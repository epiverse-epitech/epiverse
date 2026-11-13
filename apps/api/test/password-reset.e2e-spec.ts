import { INestApplication } from '@nestjs/common';
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
import { PasswordService } from '../src/security/password.service';
import { createTestApp } from './support/create-test-app';
import { FakeMailer, tokenIn } from './support/fake-mailer';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@reset.e2e.test';
const EMAIL = `ada${TEST_DOMAIN}`;
const OLD_PASSWORD = 'Lovelace1815Analytical';
const NEW_PASSWORD = 'Babbage1834Difference';
const INVALID_LINK = 'This link is invalid or has expired';

describe('Password reset (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let mailer: FakeMailer;
  let userId: number;
  // Each test uses its own client address, so counters never leak between tests.
  let ip: string;
  let nextIp = 1;

  beforeAll(async () => {
    app = await createTestApp(100, {
      LOGIN_FAILURE_MAX: 3,
      TRUST_PROXY_HOPS: 1,
    });
    prisma = app.get(PrismaService);
    mailer = app.get(Mailer) as FakeMailer;
  });

  beforeEach(async () => {
    ip = `10.1.0.${nextIp++}`;
    const user = await prisma.users.create({
      data: {
        email: EMAIL,
        password_hash: await new PasswordService().hash(OLD_PASSWORD),
        first_name: 'Ada',
        last_name: 'Lovelace',
      },
    });
    userId = user.id;
  });

  afterEach(async () => {
    mailer.failing = false;
    // Leaves time for an email still on its way, so it cannot reach the next test.
    await sleep(30);
    mailer.sent.length = 0;
    // Deleting the accounts also deletes their tokens and sessions.
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const forgot = (email: string, from = ip) =>
    request(app.getHttpServer())
      .post('/api/auth/password/forgot')
      .set('X-Forwarded-For', from)
      .send({ email });

  const reset = (token: string, password = NEW_PASSWORD) =>
    request(app.getHttpServer())
      .post('/api/auth/password/reset')
      .set('X-Forwarded-For', ip)
      .send({ token, password });

  const login = (password: string) =>
    request(app.getHttpServer())
      .post('/api/auth/login')
      .set('X-Forwarded-For', ip)
      .send({ email: EMAIL, password });

  const requestToken = async (): Promise<string> => {
    await forgot(EMAIL).expect(202);
    return tokenIn(await mailer.waitFor(EMAIL));
  };

  const createToken = async (type: 'password_reset' | 'email_verification') => {
    const token = generateSessionToken();
    await prisma.auth_token.create({
      data: {
        user_id: userId,
        type,
        token_hash: hashSessionToken(token),
        expires_at: new Date(Date.now() + 60_000),
      },
    });
    return token;
  };

  describe('asking for a link', () => {
    it('sends a link, stored only as a hash', async () => {
      const token = await requestToken();

      const message = await mailer.waitFor(EMAIL);
      expect(message.text).toContain(
        'http://localhost:8080/reset-password#token=',
      );
      const stored = await prisma.auth_token.findFirstOrThrow({
        where: { user_id: userId },
      });
      expect(stored.type).toBe('password_reset');
      expect(stored.token_hash).toBe(
        createHash('sha256').update(token).digest('hex'),
      );
    });

    it('gives the same answer for an unknown email, and sends nothing', async () => {
      const known = await forgot(EMAIL).expect(202);
      const unknownEmail = `grace${TEST_DOMAIN}`;

      const unknown = await forgot(unknownEmail).expect(202);
      await sleep(30);

      expect(unknown.body).toEqual(known.body);
      expect(mailer.countFor(unknownEmail)).toBe(0);
    });

    it.each([
      ['deactivated', { is_active: false }],
      ['deleted', { deleted_at: new Date() }],
    ])(
      'gives the same answer for a %s account, and sends nothing',
      async (_c, state) => {
        await prisma.users.update({ where: { id: userId }, data: state });

        await forgot(EMAIL).expect(202);
        await sleep(30);

        expect(mailer.countFor(EMAIL)).toBe(0);
      },
    );

    it('accepts the email in any letter case', async () => {
      await forgot(EMAIL.toUpperCase()).expect(202);

      await mailer.waitFor(EMAIL);
    });

    it('gives the same answer when the email cannot be sent', async () => {
      mailer.failing = true;

      await forgot(EMAIL).expect(202);
    });

    it('refuses a malformed email with 400', async () => {
      await forgot('ada@').expect(400);
    });

    it('cancels the previous link when a new one is requested', async () => {
      const first = await requestToken();
      await forgot(EMAIL).expect(202);
      const second = tokenIn(await mailer.waitFor(EMAIL, 2));

      await reset(first).expect(400);
      await reset(second).expect(204);
    });

    it('keeps the previous link when the new email cannot be sent', async () => {
      const first = await requestToken();
      mailer.failing = true;

      await forgot(EMAIL).expect(202);
      await sleep(50);
      mailer.failing = false;

      await reset(first).expect(204);
    });

    it('limits repeated requests the same way for known and unknown emails', async () => {
      const unknownEmail = `grace${TEST_DOMAIN}`;
      for (const email of [EMAIL, unknownEmail]) {
        for (let i = 0; i < 3; i++) {
          await forgot(email).expect(202);
        }
        const response = await forgot(email).expect(429);
        expect(Number(response.headers['retry-after'])).toBeGreaterThan(0);
      }
    });

    it('does not block the same email from another address', async () => {
      for (let i = 0; i < 3; i++) {
        await forgot(EMAIL).expect(202);
      }

      await forgot(EMAIL, '10.2.0.1').expect(202);
    });
  });

  describe('choosing a new password', () => {
    it('replaces the password: the old one fails, the new one works', async () => {
      await reset(await requestToken()).expect(204);

      await login(OLD_PASSWORD).expect(401);
      await login(NEW_PASSWORD).expect(200);
    });

    it('confirms the email address, since the link proved access to the mailbox', async () => {
      await reset(await requestToken()).expect(204);

      const user = await prisma.users.findUniqueOrThrow({
        where: { id: userId },
      });
      expect(user.email_verified_at).toBeInstanceOf(Date);
    });

    it('keeps the first verification date of an address already confirmed', async () => {
      const verifiedAt = new Date('2026-01-01T00:00:00Z');
      await prisma.users.update({
        where: { id: userId },
        data: { email_verified_at: verifiedAt },
      });

      await reset(await requestToken()).expect(204);

      const user = await prisma.users.findUniqueOrThrow({
        where: { id: userId },
      });
      expect(user.email_verified_at).toEqual(verifiedAt);
    });

    it('stores the new password as a hash', async () => {
      await reset(await requestToken()).expect(204);

      const user = await prisma.users.findUniqueOrThrow({
        where: { id: userId },
      });
      expect(user.password_hash).not.toContain(NEW_PASSWORD);
      expect(
        await new PasswordService().verify(NEW_PASSWORD, user.password_hash),
      ).toBe(true);
    });

    it('revokes every open session of the account', async () => {
      const sessions = [
        (await login(OLD_PASSWORD).expect(200)).body.token,
        (await login(OLD_PASSWORD).expect(200)).body.token,
      ];

      await reset(await requestToken()).expect(204);

      for (const session of sessions) {
        await request(app.getHttpServer())
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${session}`)
          .expect(401);
      }
    });

    it('tells the owner by email that the password changed', async () => {
      await reset(await requestToken()).expect(204);

      const notice = await mailer.waitFor(EMAIL, 2);
      expect(notice.subject).toContain('mot de passe');
      expect(notice.text).not.toContain('#token=');
    });

    it('lifts the login limit of this address, so the owner can sign in at once', async () => {
      for (let i = 0; i < 3; i++) {
        await login('Wrong1815Wrong1815').expect(401);
      }
      await login(OLD_PASSWORD).expect(429);

      await reset(await requestToken()).expect(204);

      await login(NEW_PASSWORD).expect(200);
    });

    it('refuses a link already used', async () => {
      const token = await requestToken();
      await reset(token).expect(204);

      const response = await reset(token, 'Another1815Password').expect(400);

      expect(response.body.message).toBe(INVALID_LINK);
      await login(NEW_PASSWORD).expect(200);
    });

    it('refuses an expired link and keeps the password', async () => {
      const token = await requestToken();
      await prisma.auth_token.updateMany({
        where: { user_id: userId },
        data: { expires_at: new Date(Date.now() - 1000) },
      });

      const response = await reset(token).expect(400);

      expect(response.body.message).toBe(INVALID_LINK);
      await login(OLD_PASSWORD).expect(200);
    });

    it('refuses an unknown token with the same message', async () => {
      const response = await reset(generateSessionToken()).expect(400);

      expect(response.body.message).toBe(INVALID_LINK);
    });

    it('refuses a token made for another purpose', async () => {
      const token = await createToken('email_verification');

      await reset(token).expect(400);

      await login(OLD_PASSWORD).expect(200);
    });

    it('refuses the link of a closed account and keeps the password', async () => {
      const token = await createToken('password_reset');
      await prisma.users.update({
        where: { id: userId },
        data: { is_active: false },
      });

      const response = await reset(token).expect(400);

      expect(response.body.message).toBe(INVALID_LINK);
      const user = await prisma.users.findUniqueOrThrow({
        where: { id: userId },
      });
      expect(
        await new PasswordService().verify(OLD_PASSWORD, user.password_hash),
      ).toBe(true);
    });

    it('refuses a password breaking the policy, and the link still works', async () => {
      const token = await requestToken();

      await reset(token, 'short').expect(400);

      await reset(token).expect(204);
    });
  });
});

describe('Password reset routes address limit (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp(2);
  });

  afterEach(async () => {
    await app.close();
  });

  it.each([
    ['/api/auth/password/forgot', { email: `nobody${TEST_DOMAIN}` }, 202],
    [
      '/api/auth/password/reset',
      { token: 'unknown', password: NEW_PASSWORD },
      400,
    ],
  ])('%s carries @AuthRateLimit()', async (path, body, status) => {
    const server = app.getHttpServer();
    for (let i = 0; i < 2; i++) {
      await request(server).post(path).send(body).expect(status);
    }

    await request(server).post(path).send(body).expect(429);
  });
});
