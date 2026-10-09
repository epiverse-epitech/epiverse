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

// Convertit uniquement une chaîne composée de chiffres ("8080").
// Toute autre valeur ("abc", " 8080 ", "80.5") est laissée telle quelle
// pour être refusée par la validation, au lieu d'être corrigée en silence.
const toStrictInteger = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  // Les décorateurs s'exécutent de bas en haut : IsInt est vérifié en premier,
  // et stopAtFirstError n'affiche que la première règle non respectée.
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
    throw new Error(`Configuration invalide :\n${formatErrors(errors)}`);
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
