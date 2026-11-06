import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

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
});
