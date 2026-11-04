import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { ErrorResponseDto } from './common/error-response.dto';

export function configureApp(app: INestApplication): void {
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
  if (process.env.NODE_ENV !== 'production' || process.env.API_DOCS_ENABLED === 'true') {
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
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ErrorResponseDto],
  });
  SwaggerModule.setup('api/docs', app, document);
}
