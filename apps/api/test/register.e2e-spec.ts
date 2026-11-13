import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/security/password.service';
import { createTestApp } from './support/create-test-app';
import { FakeMailer } from './support/fake-mailer';
import { Mailer } from '../src/mail/mailer';
import { setTimeout as sleep } from 'node:timers/promises';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@register.e2e.test';

const validBody = {
  email: `ada${TEST_DOMAIN}`,
  // Valid under both the current rule and the NIST one proposed in PR #28
  // (15+ characters), so these tests do not depend on which is merged first.
  password: 'Lovelace1815Analytical',
  firstName: 'Ada',
  lastName: 'Lovelace',
  // Set in beforeAll to the version the API serves.
  cguVersion: '',
};

describe('Account registration (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let mailer: FakeMailer;

  beforeAll(async () => {
    // High enough that the functional tests below never hit the limit.
    // At most 3 notices per address here.
    app = await createTestApp(100, { LOGIN_FAILURE_MAX: 3 });
    prisma = app.get(PrismaService);
    mailer = app.get(Mailer) as FakeMailer;
    validBody.cguVersion = app.get(ConfigService).get<string>('CGU_VERSION')!;
  });

  afterEach(async () => {
    // Leaves time for an email still on its way, so it cannot reach the next test.
    await sleep(30);
    mailer.sent.length = 0;
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN, mode: 'insensitive' } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const register = (body: object) =>
    request(app.getHttpServer()).post('/api/auth/register').send(body);

  const accountCount = () =>
    prisma.users.count({
      where: { email: { endsWith: TEST_DOMAIN, mode: 'insensitive' } },
    });

  it.each([
    ['an invalid email', { email: 'ada@' }],
    ['a password breaking the policy', { password: 'short' }],
    ['a missing first name', { firstName: undefined }],
    ['a blank last name', { lastName: '   ' }],
    ['an unknown field', { role: 'admin' }],
    ['terms of use not accepted', { cguVersion: undefined }],
    ['an empty terms of use version', { cguVersion: '' }],
    ['the old acceptance flag', { cguVersion: undefined, cguAccepted: true }],
  ])('rejects %s with 400 and creates no account', async (_case, override) => {
    const response = await register({ ...validBody, ...override }).expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(await accountCount()).toBe(0);
  });

  it('creates the account with a hashed password and returns only public fields', async () => {
    const response = await register(validBody).expect(201);

    expect(response.body).toEqual({
      id: expect.any(String),
      email: validBody.email,
      firstName: 'Ada',
      lastName: 'Lovelace',
    });

    const account = await prisma.users.findFirstOrThrow({
      where: { email: validBody.email },
    });
    expect(account.public_id).toBe(response.body.id);
    expect(account.password_hash).not.toBe(validBody.password);
    expect(
      await new PasswordService().verify(
        validBody.password,
        account.password_hash,
      ),
    ).toBe(true);
  });

  it('refuses an outdated terms of use version with 400 and creates no account', async () => {
    const response = await register({
      ...validBody,
      cguVersion: 'outdated',
    }).expect(400);

    expect(response.body.message).toBe(
      'The terms of use have changed: accept the current version',
    );
    expect(await accountCount()).toBe(0);
  });

  it('serves the current terms of use version', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/cgu')
      .expect(200);

    expect(response.body).toEqual({ version: validBody.cguVersion });
  });

  it('records the acceptance of the current terms of use, with version and date', async () => {
    const before = Date.now();
    const response = await register(validBody).expect(201);

    const acceptances = await prisma.user_cgu_acceptance.findMany({
      where: { users: { public_id: response.body.id } },
    });
    expect(acceptances).toHaveLength(1);
    expect(acceptances[0].version).toBe(
      app.get(ConfigService).get<string>('CGU_VERSION'),
    );
    expect(acceptances[0].accepted_at.getTime()).toBeGreaterThanOrEqual(
      before - 1000,
    );
  });

  it('stores the email in lowercase', async () => {
    const response = await register({
      ...validBody,
      email: `Ada${TEST_DOMAIN.toUpperCase()}`,
    }).expect(201);

    expect(response.body.email).toBe(validBody.email);
    expect(await accountCount()).toBe(1);
    await prisma.users.findFirstOrThrow({ where: { email: validBody.email } });
  });

  it('refuses an email already used, whatever its case, and keeps the first account', async () => {
    await register(validBody).expect(201);

    const response = await register({
      ...validBody,
      email: validBody.email.toUpperCase(),
      firstName: 'Grace',
    }).expect(409);

    expect(response.body.message).toBe(
      'An account already exists with this email',
    );
    expect(JSON.stringify(response.body)).not.toContain('Ada');
    expect(await accountCount()).toBe(1);
    const account = await prisma.users.findFirstOrThrow({
      where: { email: validBody.email },
    });
    expect(account.first_name).toBe('Ada');
  });

  describe('notice to the owner of a used address', () => {
    const noticesTo = (email: string) =>
      mailer.sent.filter((m) => m.to === email && !m.text.includes('#token='));

    it('tells the owner by email, without any link or text from the other person', async () => {
      const email = `notice1${TEST_DOMAIN}`;
      await register({ ...validBody, email }).expect(201);

      await register({ ...validBody, email, firstName: 'Grace' }).expect(409);
      await mailer.waitFor(email, 2);

      const notices = noticesTo(email);
      expect(notices).toHaveLength(1);
      expect(notices[0].subject).toContain('compte');
      expect(notices[0].text).not.toContain('Grace');
    });

    it('sends nothing to the address of a closed account', async () => {
      const email = `notice2${TEST_DOMAIN}`;
      await register({ ...validBody, email }).expect(201);
      await prisma.users.updateMany({
        where: { email },
        data: { is_active: false },
      });

      await register({ ...validBody, email }).expect(409);
      await sleep(50);

      expect(noticesTo(email)).toHaveLength(0);
    });

    it('limits the notices sent to one address, and still answers 409', async () => {
      const email = `notice3${TEST_DOMAIN}`;
      await register({ ...validBody, email }).expect(201);

      for (let i = 0; i < 5; i++) {
        await register({ ...validBody, email }).expect(409);
      }
      await sleep(50);

      expect(noticesTo(email)).toHaveLength(3);
    });
  });

  describe('Account registration rate limit (e2e)', () => {
    let app: INestApplication<App>;
    let prisma: PrismaService;

    const testAccounts = {
      email: { endsWith: TEST_DOMAIN, mode: 'insensitive' as const },
    };

    beforeAll(async () => {
      app = await createTestApp(2);
      prisma = app.get(PrismaService);
    });

    afterAll(async () => {
      await prisma.users.deleteMany({ where: testAccounts });
      await app.close();
    });

    it('blocks attempts beyond the limit, before any account is created', async () => {
      const server = app.getHttpServer();

      for (let i = 0; i < 2; i++) {
        await request(server)
          .post('/api/auth/register')
          .send({ ...validBody, email: 'ada@' })
          .expect(400);
      }

      await request(server)
        .post('/api/auth/register')
        .send(validBody)
        .expect(429);

      expect(await prisma.users.count({ where: testAccounts })).toBe(0);
    });
  });
});
