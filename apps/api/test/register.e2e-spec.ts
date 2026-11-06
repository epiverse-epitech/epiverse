import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/security/password.service';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@register.e2e.test';

const validBody = {
  email: `ada${TEST_DOMAIN}`,
  password: 'Lovelace1815',
  firstName: 'Ada',
  lastName: 'Lovelace',
};

describe('Account registration (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const register = (body: object) =>
    request(app.getHttpServer()).post('/api/auth/register').send(body);

  const accountCount = () =>
    prisma.users.count({ where: { email: { endsWith: TEST_DOMAIN } } });

  it.each([
    ['an invalid email', { email: 'ada@' }],
    ['a password breaking the policy', { password: 'short' }],
    ['a missing first name', { firstName: undefined }],
    ['a blank last name', { lastName: '   ' }],
    ['an unknown field', { role: 'admin' }],
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
});
