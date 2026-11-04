import { ExecutionContext, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EnvironmentVariables } from '../config/env.validation';
import { AUTH_RATE_LIMIT_KEY } from './auth-rate-limit.decorator';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService, Reflector],
      useFactory: (
        config: ConfigService<EnvironmentVariables, true>,
        reflector: Reflector,
      ) => ({
        throttlers: [
          {
            ttl: seconds(config.get('RATE_LIMIT_TTL_SECONDS', { infer: true })),
            limit: (context: ExecutionContext) =>
              reflector.getAllAndOverride<boolean>(AUTH_RATE_LIMIT_KEY, [
                context.getHandler(),
                context.getClass(),
              ])
                ? config.get('AUTH_RATE_LIMIT_MAX', { infer: true })
                : config.get('RATE_LIMIT_MAX', { infer: true }),
          },
        ],
      }),
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class RateLimitModule {}
