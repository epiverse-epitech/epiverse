import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { AuthRateLimit } from '../src/security/auth-rate-limit.decorator';

// Test-only route, standing in for any ordinary endpoint.
@Controller('test-rate-limit')
class TestRateLimitController {
  @Get('open')
  open(): string {
    return 'ok';
  }
  @AuthRateLimit()
  @Get('login')
  login(): string {
    return 'ok';
  }
}

describe('Rate limiting (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestRateLimitController],
    })
      .overrideProvider(ConfigService)
      .useValue(
        new ConfigService({
          RATE_LIMIT_TTL_SECONDS: 60,
          RATE_LIMIT_MAX: 3,
          AUTH_RATE_LIMIT_MAX: 2,
        }),
      )
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('beyond the general limit → 429 with Retry-After', async () => {
    const server = app.getHttpServer();

    for (let i = 0; i < 3; i++) {
      await request(server).get('/api/test-rate-limit/open').expect(200);
    }

    const response = await request(server)
      .get('/api/test-rate-limit/open')
      .expect(429);

    expect(response.headers['retry-after']).toBeDefined();
  });

  it('GET /api/health is never limited', async () => {
    const server = app.getHttpServer();

    for (let i = 0; i < 5; i++) {
      await request(server).get('/api/health').expect(200);
    }
  });

  it('@AuthRateLimit() applies the stricter limit → 429 with Retry-After', async () => {
    const server = app.getHttpServer();

    for (let i = 0; i < 2; i++) {
      await request(server).get('/api/test-rate-limit/login').expect(200);
    }

    const response = await request(server)
      .get('/api/test-rate-limit/login')
      .expect(429);

    expect(response.headers['retry-after']).toBeDefined();
  });
});
