import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/security/password.service';
import {
  generateSessionToken,
  hashSessionToken,
} from '../src/auth/session-token';
import { createTestApp } from './support/create-test-app';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@me.e2e.test';

const credentials = {
  email: `ada${TEST_DOMAIN}`,
  password: 'Lovelace1815',
};

describe('Current account (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let publicId: string;
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
    publicId = user.public_id;
    userId = user.id;
  });

  afterAll(async () => {
    // Deleting the account also deletes its sessions (ON DELETE CASCADE).
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
    await app.close();
  });

  const me = () => request(app.getHttpServer()).get('/api/auth/me');

  const openSession = async (): Promise<string> => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(credentials)
      .expect(200);
    return response.body.token;
  };

  it('returns the account behind a valid session token', async () => {
    const token = await openSession();

    const response = await me()
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toEqual({
      id: publicId,
      email: credentials.email,
      firstName: 'Ada',
      lastName: 'Lovelace',
      // This account was created without accepting the terms of use.
      cguAccepted: false,
      // No path chosen yet, so no role.
      roles: [],
    });
  });

  it.each([
    ['no Authorization header', undefined],
    ['another scheme', 'Basic YWRhOkxvdmVsYWNl'],
    ['an empty Bearer token', 'Bearer '],
    ['an unknown token', 'Bearer AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'],
  ])('refuses %s with the same generic 401', async (_case, header) => {
    const call = me();
    if (header !== undefined) call.set('Authorization', header);

    const response = await call.expect(401);

    expect(response.body.message).toBe('Authentication required');
  });

  // Writes a session straight into the database, to control its expiry.
  const createSession = async (expiresAt: Date): Promise<string> => {
    const token = generateSessionToken();
    await prisma.user_session.create({
      data: {
        user_id: userId,
        token_hash: hashSessionToken(token),
        expires_at: expiresAt,
      },
    });
    return token;
  };

  it('refuses an expired session with the same generic 401', async () => {
    const token = await createSession(new Date(Date.now() - 1000));

    const response = await me()
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(response.body.message).toBe('Authentication required');
  });

  it('accepts a session until it expires', async () => {
    const token = await createSession(new Date(Date.now() + 60_000));

    await me().set('Authorization', `Bearer ${token}`).expect(200);
  });

  it.each([
    ['deactivated', { is_active: false }],
    ['deleted', { deleted_at: new Date() }],
  ])(
    'refuses the session of an account %s after login with the same generic 401',
    async (_case, state) => {
      const token = await createSession(new Date(Date.now() + 60_000));
      await prisma.users.update({ where: { id: userId }, data: state });

      try {
        const response = await me()
          .set('Authorization', `Bearer ${token}`)
          .expect(401);

        expect(response.body.message).toBe('Authentication required');
      } finally {
        await prisma.users.update({
          where: { id: userId },
          data: { is_active: true, deleted_at: null },
        });
      }
    },
  );
});
