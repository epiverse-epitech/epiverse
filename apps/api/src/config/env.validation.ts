import { plainToInstance } from 'class-transformer';

export enum NodeEnv {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

export class EnvironmentVariables {
  NODE_ENV: NodeEnv = NodeEnv.Development;

  PORT: number = 3000;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  return plainToInstance(EnvironmentVariables, config);
}
