import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createMailer, Mailer } from './mailer';

// Global, like PrismaModule: inject Mailer in any module.
@Global()
@Module({
  providers: [
    { provide: Mailer, inject: [ConfigService], useFactory: createMailer },
  ],
  exports: [Mailer],
})
export class MailModule {}
