import { Controller, Get, INestApplication, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import {
  generateSessionToken,
  hashSessionToken,
} from '../src/auth/session-token';
import { SessionGuard } from '../src/auth/session.guard';
import { validateEnv } from '../src/config/env.validation';
import { PrismaService } from '../src/prisma/prisma.service';

// Test-only route, standing in for any protected feature of the application.
@Controller('test-cgu')
class TestProtectedController {
  @UseGuards(SessionGuard)
  @Get('protected')
  protectedRoute(): string {
    return 'ok';
  }
}

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@cgu.e2e.test';
const PENDING_MESSAGE = 'The current terms of use must be accepted';

describe('Re-acceptance of the terms of use (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let currentVersion: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestProtectedController],
    })
      .overrideProvider(ConfigService)
      .useValue(
        new ConfigService({
          ...validateEnv(process.env),
          AUTH_RATE_LIMIT_MAX: 100,
        }),
      )
      .compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    prisma = app.get(PrismaService);
    currentVersion = app.get(ConfigService).get<string>('CGU_VERSION')!;
  });

  afterEach(async () => {
    // Deleting the accounts also deletes their sessions and acceptances.
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  // Creates an account that accepted the given versions, with an open session.
  const accountWithSession = async (
    name: string,
    acceptedVersions: string[],
  ): Promise<{ id: number; token: string }> => {
    const token = generateSessionToken();
    const user = await prisma.users.create({
      data: {
        email: `${name}${TEST_DOMAIN}`,
        password_hash: 'not-used-by-these-tests',
        first_name: 'Test',
        last_name: 'Student',
        user_cgu_acceptance: {
          create: acceptedVersions.map((version) => ({ version })),
        },
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

  const call = (
    method: 'get' | 'post',
    path: string,
    token: string,
    body?: object,
  ) => {
    const req = request(app.getHttpServer())
      [method](path)
      .set('Authorization', `Bearer ${token}`);
    return body ? req.send(body) : req;
  };

  it('lets an account that accepted the current version use protected routes', async () => {
    const { token } = await accountWithSession('ada', [currentVersion]);

    await call('get', '/api/test-cgu/protected', token).expect(200);
    const me = await call('get', '/api/auth/me', token).expect(200);
    expect(me.body.cguAccepted).toBe(true);
  });

  it('refuses protected routes with 403 while the current version is not accepted', async () => {
    const { token } = await accountWithSession('grace', ['outdated']);

    const response = await call('get', '/api/test-cgu/protected', token).expect(
      403,
    );

    expect(response.body.message).toBe(PENDING_MESSAGE);
  });

  it('keeps the current account and logout available while acceptance is pending', async () => {
    const { token } = await accountWithSession('grace', ['outdated']);

    const me = await call('get', '/api/auth/me', token).expect(200);
    expect(me.body.cguAccepted).toBe(false);

    await call('post', '/api/auth/logout', token).expect(204);
  });

  it('records the acceptance of the current version, which unlocks protected routes', async () => {
    const { id, token } = await accountWithSession('grace', ['outdated']);
    const before = Date.now();

    await call('post', '/api/auth/cgu/accept', token, {
      version: currentVersion,
    }).expect(204);

    const acceptance = await prisma.user_cgu_acceptance.findUniqueOrThrow({
      where: { user_id_version: { user_id: id, version: currentVersion } },
    });
    expect(acceptance.accepted_at.getTime()).toBeGreaterThanOrEqual(
      before - 1000,
    );
    await call('get', '/api/test-cgu/protected', token).expect(200);
  });

  it('accepts the same version twice without a second record', async () => {
    const { id, token } = await accountWithSession('ada', [currentVersion]);

    await call('post', '/api/auth/cgu/accept', token, {
      version: currentVersion,
    }).expect(204);

    expect(
      await prisma.user_cgu_acceptance.count({ where: { user_id: id } }),
    ).toBe(1);
  });

  it('refuses to accept a version that is not the current one', async () => {
    const { token } = await accountWithSession('grace', ['outdated']);

    const response = await call('post', '/api/auth/cgu/accept', token, {
      version: 'outdated',
    }).expect(400);

    expect(response.body.message).toBe(
      'The terms of use have changed: accept the current version',
    );
  });

  it('refuses an acceptance without a session with 401', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/cgu/accept')
      .send({ version: currentVersion })
      .expect(401);
  });
});
