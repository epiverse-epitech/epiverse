import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { ErrorResponseDto } from './common/error-response.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/env.validation';

export function configureApp(app: INestApplication): void {
  trustConfiguredProxies(app);
  // Security headers set by the API itself (API-05), so that they are there
  // even without Caddy in front. Caddy may override some of them.
  // Same-site and not same-origin: the web app may live on another subdomain.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // The public OpenAPI spec may expose endpoints, schemas and implementation details.
  // Opt in explicitly to serve Swagger in production.
  if (
    process.env.NODE_ENV !== 'production' ||
    process.env.API_DOCS_ENABLED === 'true'
  ) {
    setupApiDocs(app);
  }
}

// Serves the interactive docs on /api/docs and the OpenAPI spec on /api/docs-json.
// Must run after setGlobalPrefix so that documented paths include /api.
function setupApiDocs(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('EpiVerse API')
    .setDescription('REST API of EpiVerse, used by the web and mobile clients.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ErrorResponseDto],
  });
  SwaggerModule.setup('api/docs', app, document);
}

// Behind a proxy, every client would otherwise share the proxy's address, and
// so a single rate limit. Each trusted hop reads one more address from the
// right of X-Forwarded-For; the entries further left can be forged by the client.
function trustConfiguredProxies(app: INestApplication): void {
  const config = app.get(ConfigService<EnvironmentVariables, true>);
  const hops = config.get('TRUST_PROXY_HOPS', { infer: true });

  app.getHttpAdapter().getInstance().set('trust proxy', hops);
}
