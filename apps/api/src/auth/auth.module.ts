import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';
import {
  EMAIL_REQUEST_ATTEMPTS,
  LoginAttempts,
} from '../security/login-attempts';
import { PasswordService } from '../security/password.service';
import { AccountTokens } from './account-tokens.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailVerificationService } from './email-verification.service';
import { PasswordResetService } from './password-reset.service';
import { SessionGuard } from './session.guard';

// Failures and email requests are counted apart, with the same limits.
const attemptsFactory = (config: ConfigService<EnvironmentVariables, true>) =>
  new LoginAttempts({
    maxFailures: config.get('LOGIN_FAILURE_MAX', { infer: true }),
    windowMs:
      config.get('LOGIN_FAILURE_WINDOW_MINUTES', { infer: true }) * 60 * 1000,
  });

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    SessionGuard,
    AccountTokens,
    EmailVerificationService,
    PasswordResetService,
    {
      provide: LoginAttempts,
      inject: [ConfigService],
      useFactory: attemptsFactory,
    },
    {
      provide: EMAIL_REQUEST_ATTEMPTS,
      inject: [ConfigService],
      useFactory: attemptsFactory,
    },
  ],
})
export class AuthModule {}
