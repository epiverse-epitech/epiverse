import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AccountTokens } from '../src/auth/account-tokens.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { createTestApp } from './support/create-test-app';

// Every account created here uses this domain, so cleanup never touches other data.
const TEST_DOMAIN = '@tokens.e2e.test';
const HOUR = 60 * 60 * 1000;

describe('One-time tokens (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let tokens: AccountTokens;
  let userId: number;

  beforeAll(async () => {
    app = await createTestApp(100);
    prisma = app.get(PrismaService);
    tokens = app.get(AccountTokens);
  });

  beforeEach(async () => {
    const user = await prisma.users.create({
      data: {
        email: `ada${TEST_DOMAIN}`,
        password_hash: 'not-used-by-these-tests',
        first_name: 'Ada',
        last_name: 'Lovelace',
      },
    });
    userId = user.id;
  });

  afterEach(async () => {
    await prisma.users.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('keeps the newest link when two sends finish in the wrong order', async () => {
    const older = await tokens.issue(userId, 'password_reset', HOUR);
    const newer = await tokens.issue(userId, 'password_reset', HOUR);

    // The newer email goes out first, then the older one.
    await tokens.cancelOlder(userId, 'password_reset', newer);
    await tokens.cancelOlder(userId, 'password_reset', older);

    expect(await tokens.consume(older, 'password_reset')).toBeNull();
    expect(await tokens.consume(newer, 'password_reset')).toBe(userId);
  });

  it('cancels only tokens of the same type', async () => {
    const verification = await tokens.issue(userId, 'email_verification', HOUR);
    const reset = await tokens.issue(userId, 'password_reset', HOUR);

    await tokens.cancelOlder(userId, 'password_reset', reset);

    expect(await tokens.consume(verification, 'email_verification')).toBe(
      userId,
    );
  });
});
