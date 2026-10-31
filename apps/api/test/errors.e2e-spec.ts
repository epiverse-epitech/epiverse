import { Test } from '@nestjs/testing';
import { Controller, Get, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

// Test-only route that fails like a real bug would, with a sensitive message.
@Controller('test-errors')
class TestErrorsController {
  @Get('crash')
  crash(): never {
    throw new Error('connect ECONNREFUSED postgresql://admin:secret@db:5432');
  }
}

describe('Error format (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestErrorsController],
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

  it('unexpected error → 500 without internal details', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/test-errors/crash')
      .expect(500);

    expect(response.body).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Internal server error',
      path: '/api/test-errors/crash',
      timestamp: expect.any(String),
    });
    expect(JSON.stringify(response.body)).not.toContain('secret');
  });
});
