import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/security/password.service';
import { createTestApp } from './support/create-test-app';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@login.e2e.test';

const credentials = {
  email: `ada${TEST_DOMAIN}`,
  password: 'Lovelace1815',
};

describe('Login (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let userId: number;

  beforeAll(async () => {
    // High enough that these tests never hit the limit.
    app = await createTestApp(100);
    prisma = app.get(PrismaService);

    // The account is created directly in the database, so these tests do not
    // depend on the registration route.
    const user = await prisma.users.create({
      data: {
        email: credentials.email,
        password_hash: await new PasswordService().hash(credentials.password),
        first_name: 'Ada',
        last_name: 'Lovelace',
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Deleting the account also deletes its sessions (ON DELETE CASCADE).
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
    await app.close();
  });

  const login = (body: object) =>
    request(app.getHttpServer()).post('/api/auth/login').send(body);

  it.each([
    ['an unknown email', { ...credentials, email: `grace${TEST_DOMAIN}` }],
    ['a wrong password', { ...credentials, password: 'Wrong1815' }],
  ])(
    'refuses %s with the same generic 401 and opens no session',
    async (_case, body) => {
      const response = await login(body).expect(401);

      expect(response.body.message).toBe('Invalid email or password');
      expect(
        await prisma.user_session.count({ where: { user_id: userId } }),
      ).toBe(0);
    },
  );

  it('refuses a malformed request with 400', async () => {
    await login({ email: 'ada@' }).expect(400);
  });
});
