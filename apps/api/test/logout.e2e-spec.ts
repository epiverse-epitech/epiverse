import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/security/password.service';
import { createTestApp } from './support/create-test-app';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@logout.e2e.test';

const credentials = {
  email: `ada${TEST_DOMAIN}`,
  password: 'Lovelace1815',
};

describe('Logout (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let userId: number;

  beforeAll(async () => {
    // High enough that these tests never hit the limit.
    app = await createTestApp(100);
    prisma = app.get(PrismaService);

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

  afterEach(async () => {
    await prisma.user_session.deleteMany({ where: { user_id: userId } });
  });

  afterAll(async () => {
    // Deleting the account also deletes its sessions (ON DELETE CASCADE).
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
    await app.close();
  });

  const openSession = async (): Promise<string> => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);
    return response.body.token;
  };

  const logout = (token?: string) => {
    const call = request(app.getHttpServer()).post('/api/auth/logout');
    return token ? call.set('Authorization', `Bearer ${token}`) : call;
  };

  const me = (token: string) =>
    request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

  it('revokes the session, which then no longer opens protected routes', async () => {
    const token = await openSession();

    await logout(token).expect(204);

    const sessions = await prisma.user_session.findMany({
      where: { user_id: userId },
    });
    expect(sessions).toHaveLength(1);
    expect(sessions[0].revoked_at).toBeInstanceOf(Date);

    const response = await me(token).expect(401);
    expect(response.body.message).toBe('Authentication required');
  });

  it('keeps the other sessions of the account open', async () => {
    const otherDevice = await openSession();
    const token = await openSession();

    await logout(token).expect(204);

    await me(otherDevice).expect(200);
  });

  it('refuses a logout without a session with 401', async () => {
    await logout().expect(401);
  });

  it('refuses a second logout with the same token with 401', async () => {
    const token = await openSession();
    await logout(token).expect(204);

    await logout(token).expect(401);
  });
});
