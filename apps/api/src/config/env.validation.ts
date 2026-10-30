import { plainToInstance, Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  Max,
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
