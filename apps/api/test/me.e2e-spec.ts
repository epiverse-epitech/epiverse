import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { PasswordService } from '../src/security/password.service';
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
});
