import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

describe('Error format (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/unknown → 404 in the standard error format', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/unknown')
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Cannot GET /api/unknown',
      path: '/api/unknown',
      timestamp: expect.any(String),
    });
  });
});
