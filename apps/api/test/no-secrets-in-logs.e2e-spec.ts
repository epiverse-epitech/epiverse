import { jest } from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setTimeout as sleep } from 'node:timers/promises';
import request from 'supertest';
import { App } from 'supertest/types';
import { Mailer } from '../src/mail/mailer';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './support/create-test-app';
import { FakeMailer, tokenIn } from './support/fake-mailer';

// NFR-SEC-001 and NFR-OBS-001: whatever happens in the account flows, the
// diagnostic output never contains a password, a token or an email address.
// Every write to stdout and stderr is captured, Nest logs included.

const TEST_DOMAIN = '@logs.e2e.test';
const EMAIL = `ada${TEST_DOMAIN}`;
const PASSWORD = 'Lovelace1815Analytical';
const WRONG_PASSWORD = 'Wrong1815Wrong1815';
const NEW_PASSWORD = 'Babbage1834Difference';

describe('No secrets in logs (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let mailer: FakeMailer;
  let output: string[];
  let restore: () => void;

  beforeAll(async () => {
    app = await createTestApp(100);
    prisma = app.get(PrismaService);
    mailer = app.get(Mailer) as FakeMailer;
  });

  beforeEach(() => {
    output = [];
    const capture = (chunk: unknown): boolean => {
      output.push(String(chunk));
      return true;
    };
    const out = jest.spyOn(process.stdout, 'write').mockImplementation(capture);
    const err = jest.spyOn(process.stderr, 'write').mockImplementation(capture);
    restore = () => {
      out.mockRestore();
      err.mockRestore();
    };
  });

  afterEach(async () => {
    restore();
    mailer.failing = false;
    mailer.sent.length = 0;
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const server = () => app.getHttpServer();

  const runAccountFlows = async (): Promise<string[]> => {
    const cguVersion = app.get(ConfigService).get<string>('CGU_VERSION');
    const secrets = [EMAIL, PASSWORD, WRONG_PASSWORD, NEW_PASSWORD];

    await request(server())
      .post('/api/auth/register')
      .send({
        email: EMAIL,
        password: PASSWORD,
        firstName: 'Ada',
        lastName: 'Lovelace',
        cguVersion,
      })
      .expect(201);
    // Same address again: 409 and a notice to the owner.
    await request(server())
      .post('/api/auth/register')
      .send({
        email: EMAIL,
        password: PASSWORD,
        firstName: 'Ada',
        lastName: 'Lovelace',
        cguVersion,
      })
      .expect(409);

    await request(server())
      .post('/api/auth/login')
      .send({ email: EMAIL, password: WRONG_PASSWORD })
      .expect(401);
    const login = await request(server())
      .post('/api/auth/login')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(200);
    const session: string = login.body.token;
    secrets.push(session);

    await request(server())
      .post('/api/auth/email/resend')
      .set('Authorization', `Bearer ${session}`)
      .expect(202);
    await request(server())
      .post('/api/auth/password/forgot')
      .send({ email: EMAIL })
      .expect(202);
    await request(server())
      .post('/api/auth/password/reset')
      .send({ token: 'not-a-real-token', password: NEW_PASSWORD })
      .expect(400);

    await sleep(100);
    for (const message of mailer.sent) {
      if (message.text.includes('#token=')) {
        secrets.push(tokenIn(message));
      }
    }
    const user = await prisma.users.findFirst({ where: { email: EMAIL } });
    if (user) {
      secrets.push(user.password_hash);
    }
    return secrets;
  };

  const leaked = (secrets: string[]): string[] => {
    const logs = output.join('');
    return secrets.filter((secret) => logs.includes(secret));
  };

  it('writes none of them when every email goes through', async () => {
    const secrets = await runAccountFlows();

    expect(secrets.length).toBeGreaterThan(5);
    expect(leaked(secrets)).toEqual([]);
  });

  it('writes none of them when the mail server fails, though the failures are logged', async () => {
    mailer.failing = true;

    const secrets = await runAccountFlows();

    expect(output.join('')).toContain('could not be sent');
    expect(leaked(secrets)).toEqual([]);
  });
});
