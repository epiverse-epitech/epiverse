import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';
import { LoginAttempts } from '../security/login-attempts';
import { PasswordService } from '../security/password.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './session.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    SessionGuard,
    {
      provide: LoginAttempts,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) =>
        new LoginAttempts({
          maxFailures: config.get('LOGIN_FAILURE_MAX', { infer: true }),
          windowMs:
            config.get('LOGIN_FAILURE_WINDOW_MINUTES', { infer: true }) *
            60 *
            1000,
        }),
    },
  ],
})
export class AuthModule {}
