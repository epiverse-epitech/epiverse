import { plainToInstance, Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  validateSync,
  ValidationError,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

// Converts only a string made of digits ("8080").
// Any other value ("abc", " 8080 ", "80.5") is left as is so that validation
// rejects it, instead of silently fixing it.
const toStrictInteger = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  // Decorators run bottom-up: IsInt is checked first, and stopAtFirstError
  // reports only the first failing rule.
  @Transform(toStrictInteger)
  @Max(65535)
  @Min(1)
  @IsInt()
  PORT: number = 3000;

  @Transform(toStrictInteger)
  @Min(1)
  @IsInt()
  RATE_LIMIT_TTL_SECONDS: number = 60;

  @Transform(toStrictInteger)
  @Min(1)
  @IsInt()
  RATE_LIMIT_MAX: number = 100;

  @Transform(toStrictInteger)
  @Min(1)
  @IsInt()
  // Per client address on credential routes. Sized for a campus where many
  // students share one address: guessing one account is already capped by
  // LOGIN_FAILURE_MAX, so this limit only slows down trying many accounts.
  AUTH_RATE_LIMIT_MAX: number = 30;

  // Failed logins allowed per account and client address within the window
  // (NFR-SEC-003). Students behind one address each get their own count.
  @Transform(toStrictInteger)
  @Min(1)
  @IsInt()
  LOGIN_FAILURE_MAX: number = 5;

  @Transform(toStrictInteger)
  @Min(1)
  @IsInt()
  LOGIN_FAILURE_WINDOW_MINUTES: number = 15;

  // Number of reverse proxies in front of the API. At 0, X-Forwarded-For is
  // ignored, so a client cannot forge its address when no proxy is there.
  @Transform(toStrictInteger)
  @Min(0)
  @IsInt()
  TRUST_PROXY_HOPS: number = 0;

  // How long a session stays valid after login. Sessions can also be revoked
  // at any time (logout, password change).
  @Transform(toStrictInteger)
  @Min(1)
  @IsInt()
  SESSION_TTL_HOURS: number = 168;

  // Version of the terms of use (CGU) that new accounts accept. Raise it when
  // the terms change; the column user_cgu_acceptance.version holds 20 characters.
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  CGU_VERSION: string = '1.0';

  @IsUrl({
    protocols: ['postgresql', 'postgres'],
    require_protocol: true,
    require_tld: false,
  })
  DATABASE_URL: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(env, {
    whitelist: true,
    stopAtFirstError: true,
  });

  if (errors.length > 0) {
    throw new Error(`Invalid configuration:\n${formatErrors(errors)}`);
  }

  return env;
}

function formatErrors(errors: ValidationError[]): string {
  return errors
    .map(
      (error) =>
        `- ${error.property} : ${Object.values(error.constraints ?? {}).join(', ')}`,
    )
    .join('\n');
}
