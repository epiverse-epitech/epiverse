import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { Mailer } from '../src/mail/mailer';
import { PasswordService } from '../src/security/password.service';
import { createTestApp } from './support/create-test-app';
import { FakeMailer } from './support/fake-mailer';
import { setTimeout as sleep } from 'node:timers/promises';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@register.e2e.test';
// Same answer whether the address was free or not, so it reveals no account.
const ANSWER = { message: 'Check your email to continue' };

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
  // Each test uses its own client address, so counters never leak between tests.
  let ip: string;
  let nextIp = 1;

  beforeAll(async () => {
    // The address limit is high; the limit per email and address is 3.
    app = await createTestApp(100, {
      LOGIN_FAILURE_MAX: 3,
      TRUST_PROXY_HOPS: 1,
    });
    prisma = app.get(PrismaService);
    mailer = app.get(Mailer) as FakeMailer;
    validBody.cguVersion = app.get(ConfigService).get<string>('CGU_VERSION')!;
  });

  beforeEach(() => {
    ip = `10.3.0.${nextIp++}`;
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

  const register = (body: object, from = ip) =>
    request(app.getHttpServer())
      .post('/api/auth/register')
      .set('X-Forwarded-For', from)
      .send(body);

  // Waits until the given number of emails reached the address.
  const emailsTo = async (email: string, count: number) => {
    await mailer.waitFor(email, count);
    return mailer.sent.filter((m) => m.to === email);
  };

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

  it('creates the account with a hashed password, and answers without any account data', async () => {
    const response = await register(validBody).expect(202);

    expect(response.body).toEqual(ANSWER);

    const account = await prisma.users.findFirstOrThrow({
      where: { email: validBody.email },
    });
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
    await register(validBody).expect(202);

    const acceptances = await prisma.user_cgu_acceptance.findMany({
      where: { users: { email: validBody.email } },
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
    await register({
      ...validBody,
      email: `Ada${TEST_DOMAIN.toUpperCase()}`,
    }).expect(202);

    expect(await accountCount()).toBe(1);
    await prisma.users.findFirstOrThrow({ where: { email: validBody.email } });
  });

  it('gives the same answer when the email is already used, whatever its case, and keeps the first account', async () => {
    const first = await register(validBody).expect(202);

    const second = await register({
      ...validBody,
      email: validBody.email.toUpperCase(),
      firstName: 'Grace',
    }).expect(202);

    expect(second.body).toEqual(first.body);
    expect(await accountCount()).toBe(1);
    const account = await prisma.users.findFirstOrThrow({
      where: { email: validBody.email },
    });
    expect(account.first_name).toBe('Ada');
  });

  it('tells the owner of the address, by email and without any link, that someone tried to register', async () => {
    await register(validBody).expect(202);
    await register({ ...validBody, firstName: 'Grace' }).expect(202);

    const emails = await emailsTo(validBody.email, 2);
    const notice = emails.find((m) => !m.text.includes('#token='));
    expect(notice?.subject).toContain('compte');
    expect(notice?.text).not.toContain('Grace');
  });

  it('sends nothing to the address of a closed account', async () => {
    await register(validBody).expect(202);
    await mailer.waitFor(validBody.email);
    await prisma.users.updateMany({
      where: { email: validBody.email },
      data: { is_active: false },
    });

    await register(validBody).expect(202);
    await sleep(50);

    expect(mailer.countFor(validBody.email)).toBe(1);
  });

  it('limits repeated registrations of one email from one address, whatever the outcome', async () => {
    for (let i = 0; i < 3; i++) {
      await register(validBody).expect(202);
    }

    const response = await register(validBody).expect(429);

    expect(Number(response.headers['retry-after'])).toBeGreaterThan(0);
    await register(validBody, '10.4.0.1').expect(202);
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
