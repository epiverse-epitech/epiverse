import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/security/password.service';
import { createTestApp } from './support/create-test-app';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@login-limit.e2e.test';
const PASSWORD = 'Lovelace1815';
const ada = `ada${TEST_DOMAIN}`;
const grace = `grace${TEST_DOMAIN}`;

describe('Login failure limit per account and address (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    // The address limit is set high so that only the account limit is tested.
    // One trusted proxy lets each test pick its client address.
    app = await createTestApp(100, {
      LOGIN_FAILURE_MAX: 3,
      TRUST_PROXY_HOPS: 1,
    });
    prisma = app.get(PrismaService);

    const passwordHash = await new PasswordService().hash(PASSWORD);
    for (const email of [ada, grace]) {
      await prisma.users.create({
        data: {
          email,
          password_hash: passwordHash,
          first_name: 'Test',
          last_name: 'Student',
        },
      });
    }
  });

  afterAll(async () => {
    // Deleting the accounts also deletes their sessions (ON DELETE CASCADE).
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
    await app.close();
  });

  // Each test uses its own address, so the counters of one test never leak
  // into another.
  const login = (ip: string, email: string, password: string) =>
    request(app.getHttpServer())
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email, password });

  const failTimes = async (ip: string, email: string, times: number) => {
    for (let i = 0; i < times; i++) {
      await login(ip, email, 'Wrong1815').expect(401);
    }
  };

  it('blocks an account from one address after too many failures, even with the right password', async () => {
    await failTimes('10.0.0.1', ada, 3);

    const response = await login('10.0.0.1', ada, PASSWORD).expect(429);

    expect(response.body.message).toBe(
      'Too many failed login attempts, try again later',
    );
    expect(Number(response.headers['retry-after'])).toBeGreaterThan(0);
  });

  it('does not block the other students behind the same address', async () => {
    await failTimes('10.0.0.2', ada, 3);

    await login('10.0.0.2', grace, PASSWORD).expect(200);
    await login('10.0.0.2', grace, 'Wrong1815').expect(401);
  });

  it('does not block the same account from another address', async () => {
    await failTimes('10.0.0.3', ada, 3);

    await login('10.0.0.4', ada, PASSWORD).expect(200);
  });

  it('counts unknown emails too, so a 429 does not reveal which accounts exist', async () => {
    const unknown = `nobody${TEST_DOMAIN}`;
    await failTimes('10.0.0.5', unknown, 3);

    await login('10.0.0.5', unknown, PASSWORD).expect(429);
  });

  it('forgets the failures after a successful login', async () => {
    await failTimes('10.0.0.6', ada, 2);
    await login('10.0.0.6', ada, PASSWORD).expect(200);

    await failTimes('10.0.0.6', ada, 3);
  });
});

describe('Login address limit (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp(2);
  });

  afterAll(async () => {
    await app.close();
  });

  it('carries @AuthRateLimit(): too many attempts from one address get 429', async () => {
    const server = app.getHttpServer();
    // Different emails, so only the address limit can block.
    for (const name of ['alan', 'barbara']) {
      await request(server)
        .post('/api/auth/login')
        .send({ email: `${name}${TEST_DOMAIN}`, password: PASSWORD })
        .expect(401);
    }

    await request(server)
      .post('/api/auth/login')
      .send({ email: `edsger${TEST_DOMAIN}`, password: PASSWORD })
      .expect(429);
  });
});
