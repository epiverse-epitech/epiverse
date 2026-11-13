import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from './support/create-test-app';

// API-05: security headers set by the API itself, so that they are there even
// when the API is reached without Caddy (local, misrouted proxy).
describe('HTTP security headers (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await createTestApp(100);
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    ['a JSON route', '/api/health', 200],
    ['an error', '/api/unknown', 404],
  ])('sets them on %s', async (_case, path, status) => {
    const response = await request(app.getHttpServer())
      .get(path)
      .expect(status);

    expect(response.headers['x-powered-by']).toBeUndefined();
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['referrer-policy']).toBe('no-referrer');
    expect(response.headers['content-security-policy']).toContain(
      "frame-ancestors 'self'",
    );
    expect(response.headers['cross-origin-resource-policy']).toBe('same-site');
  });

  it('keeps the interactive docs usable', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/docs')
      .redirects(1)
      .expect(200);

    expect(response.text).toContain('swagger');
  });
});
