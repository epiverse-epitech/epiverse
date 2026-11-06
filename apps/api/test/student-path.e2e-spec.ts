import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  generateSessionToken,
  hashSessionToken,
} from '../src/auth/session-token';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './support/create-test-app';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@student-path.e2e.test';

describe('Student path (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let currentCgu: string;

  beforeAll(async () => {
    app = await createTestApp(100);
    prisma = app.get(PrismaService);
    currentCgu = app.get(ConfigService).get<string>('CGU_VERSION')!;
  });

  afterEach(async () => {
    // Deleting the accounts also deletes their sessions, roles and profiles.
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  // Creates an account with an open session, which accepted the given terms.
  const accountWithSession = async (
    name: string,
    cguVersion: string = currentCgu,
  ): Promise<{ id: number; token: string }> => {
    const token = generateSessionToken();
    const user = await prisma.users.create({
      data: {
        email: `${name}${TEST_DOMAIN}`,
        password_hash: 'not-used-by-these-tests',
        first_name: 'Ada',
        last_name: 'Lovelace',
        user_cgu_acceptance: { create: { version: cguVersion } },
        user_session: {
          create: {
            token_hash: hashSessionToken(token),
            expires_at: new Date(Date.now() + 60_000),
          },
        },
      },
    });
    return { id: user.id, token };
  };

  const chooseStudentPath = (token?: string) => {
    const call = request(app.getHttpServer()).post('/api/me/paths/student');
    return token ? call.set('Authorization', `Bearer ${token}`) : call;
  };

  const me = (token: string) =>
    request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

  it('gives the Student role and an empty student profile, without approval', async () => {
    const { id, token } = await accountWithSession('ada');

    const response = await chooseStudentPath(token).expect(200);

    expect(response.body.roles).toEqual(['student']);
    const roles = await prisma.user_role.findMany({
      where: { user_id: id },
      select: { role: { select: { name: true } } },
    });
    expect(roles.map((r) => r.role.name)).toEqual(['student']);
    expect(
      await prisma.student_profile.findUnique({ where: { user_id: id } }),
    ).not.toBeNull();
  });

  it('shows the roles of the account on GET /api/auth/me', async () => {
    const { token } = await accountWithSession('ada');

    expect((await me(token).expect(200)).body.roles).toEqual([]);
    await chooseStudentPath(token).expect(200);
    expect((await me(token).expect(200)).body.roles).toEqual(['student']);
  });

  it('can be chosen again without duplicating anything or losing the profile', async () => {
    const { id, token } = await accountWithSession('ada');
    await chooseStudentPath(token).expect(200);
    await prisma.student_profile.update({
      where: { user_id: id },
      data: { bio: 'Kept' },
    });

    await chooseStudentPath(token).expect(200);

    expect(await prisma.user_role.count({ where: { user_id: id } })).toBe(1);
    const profile = await prisma.student_profile.findUniqueOrThrow({
      where: { user_id: id },
    });
    expect(profile.bio).toBe('Kept');
  });

  it('refuses a request without a session with 401', async () => {
    await chooseStudentPath().expect(401);
  });

  it('refuses an account that has not accepted the current terms of use with 403', async () => {
    const { id, token } = await accountWithSession('grace', 'outdated');

    await chooseStudentPath(token).expect(403);

    expect(await prisma.user_role.count({ where: { user_id: id } })).toBe(0);
  });
});
