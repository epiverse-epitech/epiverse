import { Test } from '@nestjs/testing';
import { Controller, Get, HttpException, HttpStatus, INestApplication, InternalServerErrorException, Logger } from '@nestjs/common';
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

  @Get('explicit-500')
  explicit500(): never {
    throw new InternalServerErrorException('DATABASE_URL=postgresql://admin:secret@db');
  }

  @Get('custom-503')
  custom503(): never {
    throw new HttpException({ message: 'internal service secret', error: 'Secret Error' }, 503);
  }

  @Get('custom-400')
  custom400(): never {
    throw new HttpException({ error: 'Custom error' }, HttpStatus.BAD_REQUEST);
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
  it.each([
    ['/api/test-errors/explicit-500', 500, 'Internal Server Error'],
    ['/api/test-errors/custom-503', 503, 'Service Unavailable'],
  ])('HTTP 5xx at %s never exposes internal details', async (path, status, error) => {
    const response = await request(app.getHttpServer()).get(path).expect(status);
    expect(response.body).toEqual({
      statusCode: status,
      error,
      message: 'Internal server error',
      path,
      timestamp: expect.any(String),
    });
    expect(JSON.stringify(response.body)).not.toMatch(/secret|DATABASE_URL/i);
  });

  it('custom HTTP 400 always includes a nonempty message', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/test-errors/custom-400')
      .expect(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Custom error',
      message: 'Bad Request',
      path: '/api/test-errors/custom-400',
      timestamp: expect.any(String),
    });
  });

  it('never writes raw exception secrets or stack traces to logs', async () => {
    const logger = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    try {
      await request(app.getHttpServer()).get('/api/test-errors/crash').expect(500);
      await request(app.getHttpServer()).get('/api/test-errors/explicit-500').expect(500);
      expect(logger).toHaveBeenCalled();
      expect(logger.mock.calls.flat().join(' ')).not.toMatch(
        /secret|DATABASE_URL|postgresql:|ECONNREFUSED|admin/i,
      );
    } finally {
      logger.mockRestore();
    }
  });

});
