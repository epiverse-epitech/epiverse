import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HealthController } from '../src/health/health.controller';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

describe('API documentation (e2e)', () => {
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

  it('GET /api/docs-json → OpenAPI spec including /api/health', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);

    expect(response.body.openapi).toMatch(/^3\./);
    expect(response.body.paths).toHaveProperty(['/api/health']);
  });

  it('documents the health route response', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);

    const health = response.body.paths['/api/health'].get;
    expect(health.tags).toEqual(['health']);
    expect(health.responses['200'].content['application/json'].schema).toEqual({
      $ref: '#/components/schemas/HealthStatusDto',
    });
  });

  it('documents the standard error format', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200);

    const schema = response.body.components.schemas.ErrorResponseDto;
    expect(Object.keys(schema.properties).sort()).toEqual([
      'error',
      'message',
      'path',
      'statusCode',
      'timestamp',
    ]);
  });
  it('does not expose Swagger routes in production by default', async () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousDocsFlag = process.env.API_DOCS_ENABLED;
    let productionApp: INestApplication<App> | undefined;
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.API_DOCS_ENABLED;
      // A minimal module avoids opening another Prisma connection in this test.
      const moduleRef = await Test.createTestingModule({
        controllers: [HealthController],
      }).compile();
      productionApp = moduleRef.createNestApplication();
      configureApp(productionApp);
      await productionApp.init();
      await request(productionApp.getHttpServer()).get('/api/docs').expect(404);
      await request(productionApp.getHttpServer()).get('/api/docs-json').expect(404);
      await request(productionApp.getHttpServer()).get('/api/health').expect(200);
    } finally {
      if (productionApp) await productionApp.close();
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
      if (previousDocsFlag === undefined) delete process.env.API_DOCS_ENABLED;
      else process.env.API_DOCS_ENABLED = previousDocsFlag;
    }
  });

});
