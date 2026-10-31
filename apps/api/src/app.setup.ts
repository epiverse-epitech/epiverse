import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

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
  setupApiDocs(app);
}

// Serves the interactive docs on /api/docs and the OpenAPI spec on /api/docs-json.
// Must run after setGlobalPrefix so that documented paths include /api.
function setupApiDocs(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('EpiVerse API')
    .setDescription('REST API of EpiVerse, used by the web and mobile clients.')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);
}
