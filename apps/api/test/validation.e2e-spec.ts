import { Test } from '@nestjs/testing';
import { Body, Controller, INestApplication, Post } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

// Test-only DTO and route, standing in for a real endpoint such as registration.
class CreateContactDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  name!: string;
}

@Controller('test-validation')
class TestValidationController {
  @Post()
  create(@Body() body: CreateContactDto): CreateContactDto {
    return body;
  }
}

describe('Request validation (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestValidationController],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('valid body → accepted', () => {
    return request(app.getHttpServer())
      .post('/api/test-validation')
      .send({ email: 'ada@epitech.eu', name: 'Ada' })
      .expect(201)
      .expect({ email: 'ada@epitech.eu', name: 'Ada' });
  });

  it('invalid body → 400 listing every invalid field', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/test-validation')
      .send({ email: 'not-an-email', name: 'A' })
      .expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      path: '/api/test-validation',
    });
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        'email must be an email',
        'name must be longer than or equal to 2 characters',
      ]),
    );
  });

  it('unknown field → 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/test-validation')
      .send({ email: 'ada@epitech.eu', name: 'Ada', role: 'admin' })
      .expect(400);

    expect(response.body.message).toContain('property role should not exist');
  });
});
