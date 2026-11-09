import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { validateEnv } from '../../src/config/env.validation';
import { Mailer } from '../../src/mail/mailer';
import { FakeMailer } from './fake-mailer';

// Builds the app with the real configuration, except the stricter limit on
// credential routes, which each test group sets for itself, and any other
// variable a test group needs to change.
export async function createTestApp(
  authRateLimitMax: number,
  overrides: Record<string, number> = {},
): Promise<INestApplication<App>> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useValue(
      new ConfigService({
        ...validateEnv(process.env),
        AUTH_RATE_LIMIT_MAX: authRateLimitMax,
        ...overrides,
      }),
    )
    .overrideProvider(Mailer)
    .useValue(new FakeMailer())
    .compile();

  const app: INestApplication<App> = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return app;
}
