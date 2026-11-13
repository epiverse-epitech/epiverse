import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  generateSessionToken,
  hashSessionToken,
} from '../src/auth/session-token';
import { Mailer } from '../src/mail/mailer';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './support/create-test-app';
import { FakeMailer, tokenIn } from './support/fake-mailer';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@verify.e2e.test';
const INVALID_LINK = 'This link is invalid or has expired';

describe('Email verification (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let mailer: FakeMailer;
  let currentCgu: string;

  beforeAll(async () => {
    // Email requests are limited to 3 per account here.
    app = await createTestApp(100, { LOGIN_FAILURE_MAX: 3 });
    prisma = app.get(PrismaService);
    mailer = app.get(Mailer) as FakeMailer;
    currentCgu = app.get(ConfigService).get<string>('CGU_VERSION')!;
  });

  afterEach(async () => {
    mailer.failing = false;
    mailer.sent.length = 0;
    // Deleting the accounts also deletes their tokens and sessions.
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const register = (email: string) =>
    request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password: 'Lovelace1815Analytical',
        firstName: 'Ada',
        lastName: 'Lovelace',
        cguVersion: currentCgu,
      })
      .expect(201);

  const verify = (token: string) =>
    request(app.getHttpServer()).post('/api/auth/email/verify').send({ token });

  const verifiedAt = async (email: string): Promise<Date | null> =>
    (await prisma.users.findFirstOrThrow({ where: { email } }))
      .email_verified_at;

  // Opens a session directly in the database, for the given account.
  const openSession = async (email: string): Promise<string> => {
    const user = await prisma.users.findFirstOrThrow({ where: { email } });
    const token = generateSessionToken();
    await prisma.user_session.create({
      data: {
        user_id: user.id,
        token_hash: hashSessionToken(token),
        expires_at: new Date(Date.now() + 60_000),
      },
    });
    return token;
  };

  const resend = (sessionToken: string) =>
    request(app.getHttpServer())
      .post('/api/auth/email/resend')
      .set('Authorization', `Bearer ${sessionToken}`);

  const me = (sessionToken: string) =>
    request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${sessionToken}`);

  it('sends a link at registration, stored only as a hash, and the address stays unverified', async () => {
    const email = `ada${TEST_DOMAIN}`;
    await register(email);

    const message = await mailer.waitFor(email);
    const token = tokenIn(message);

    expect(message.text).toContain('http://localhost:8080/verify-email#token=');
    const stored = await prisma.auth_token.findFirstOrThrow({
      where: { users: { email } },
    });
    expect(stored.type).toBe('email_verification');
    expect(stored.token_hash).toBe(
      createHash('sha256').update(token).digest('hex'),
    );
    expect(await verifiedAt(email)).toBeNull();
  });

  it('verifies the address with the link, without needing a session', async () => {
    const email = `ada${TEST_DOMAIN}`;
    await register(email);
    const session = await openSession(email);
    expect((await me(session).expect(200)).body.emailVerified).toBe(false);

    await verify(tokenIn(await mailer.waitFor(email))).expect(204);

    expect(await verifiedAt(email)).toBeInstanceOf(Date);
    expect((await me(session).expect(200)).body.emailVerified).toBe(true);
  });

  it('refuses a link already used', async () => {
    const email = `ada${TEST_DOMAIN}`;
    await register(email);
    const token = tokenIn(await mailer.waitFor(email));
    await verify(token).expect(204);

    const response = await verify(token).expect(400);

    expect(response.body.message).toBe(INVALID_LINK);
  });

  it('refuses an expired link, and the address stays unverified', async () => {
    const email = `ada${TEST_DOMAIN}`;
    await register(email);
    const token = tokenIn(await mailer.waitFor(email));
    await prisma.auth_token.updateMany({
      where: { users: { email } },
      data: { expires_at: new Date(Date.now() - 1000) },
    });

    const response = await verify(token).expect(400);

    expect(response.body.message).toBe(INVALID_LINK);
    expect(await verifiedAt(email)).toBeNull();
  });

  it('refuses an unknown token with the same message', async () => {
    const response = await verify(generateSessionToken()).expect(400);

    expect(response.body.message).toBe(INVALID_LINK);
  });

  it('refuses a token made for another purpose', async () => {
    const email = `ada${TEST_DOMAIN}`;
    await register(email);
    const user = await prisma.users.findFirstOrThrow({ where: { email } });
    const token = generateSessionToken();
    await prisma.auth_token.create({
      data: {
        user_id: user.id,
        type: 'password_reset',
        token_hash: hashSessionToken(token),
        expires_at: new Date(Date.now() + 60_000),
      },
    });

    await verify(token).expect(400);

    expect(await verifiedAt(email)).toBeNull();
  });

  it('refuses the link of a closed account', async () => {
    const email = `ada${TEST_DOMAIN}`;
    await register(email);
    const token = tokenIn(await mailer.waitFor(email));
    await prisma.users.updateMany({
      where: { email },
      data: { is_active: false },
    });

    const response = await verify(token).expect(400);

    expect(response.body.message).toBe(INVALID_LINK);
    expect(await verifiedAt(email)).toBeNull();
  });

  it('refuses a malformed request with 400', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/email/verify')
      .send({})
      .expect(400);
  });

  it('still creates the account when the email cannot be sent', async () => {
    mailer.failing = true;
    const email = `ada${TEST_DOMAIN}`;

    await register(email);
    await sleep(50);

    expect(await prisma.users.count({ where: { email } })).toBe(1);
  });

  describe('resending the link', () => {
    it('sends a new link and cancels the previous one', async () => {
      const email = `ada${TEST_DOMAIN}`;
      await register(email);
      const first = tokenIn(await mailer.waitFor(email));
      const session = await openSession(email);

      await resend(session).expect(202);

      const second = tokenIn(await mailer.waitFor(email, 2));
      await verify(first).expect(400);
      await verify(second).expect(204);
    });

    it('keeps the previous link when the new email cannot be sent', async () => {
      const email = `ada${TEST_DOMAIN}`;
      await register(email);
      const first = tokenIn(await mailer.waitFor(email));
      const session = await openSession(email);
      mailer.failing = true;

      await resend(session).expect(202);
      await sleep(50);
      mailer.failing = false;

      await verify(first).expect(204);
    });

    it('sends nothing when the address is already verified', async () => {
      const email = `ada${TEST_DOMAIN}`;
      await register(email);
      await verify(tokenIn(await mailer.waitFor(email))).expect(204);
      const session = await openSession(email);

      await resend(session).expect(202);
      await sleep(50);

      expect(mailer.countFor(email)).toBe(1);
    });

    it('stays available while the terms of use are pending', async () => {
      const email = `ada${TEST_DOMAIN}`;
      await register(email);
      await mailer.waitFor(email);
      await prisma.user_cgu_acceptance.deleteMany({
        where: { users: { email } },
      });
      const session = await openSession(email);

      await resend(session).expect(202);
    });

    it('refuses a request without a session with 401', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/email/resend')
        .expect(401);
    });

    it('limits the emails sent to one account, whatever the address of the client', async () => {
      const email = `ada${TEST_DOMAIN}`;
      await register(email);
      await mailer.waitFor(email);
      const session = await openSession(email);
      for (let i = 0; i < 3; i++) {
        await resend(session).expect(202);
      }

      const response = await resend(session).expect(429);

      expect(Number(response.headers['retry-after'])).toBeGreaterThan(0);
    });
  });
});

describe('Email verification routes address limit (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp(2);
  });

  afterAll(async () => {
    await app.close();
  });

  it('carries @AuthRateLimit(): too many attempts from one address get 429', async () => {
    const server = app.getHttpServer();
    for (let i = 0; i < 2; i++) {
      await request(server)
        .post('/api/auth/email/verify')
        .send({ token: 'unknown' })
        .expect(400);
    }

    await request(server)
      .post('/api/auth/email/verify')
      .send({ token: 'unknown' })
      .expect(429);
  });
});
