import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Database connection (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('runs a query once the application has started', async () => {
    const result = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;

    expect(result).toEqual([{ ok: 1 }]);
  });

  it('disconnects from the database when the application stops', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const stoppingApp = moduleRef.createNestApplication();
    await stoppingApp.init();
    const disconnect = jest.spyOn(stoppingApp.get(PrismaService), '$disconnect');

    await stoppingApp.close();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
