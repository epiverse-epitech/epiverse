import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('applique les valeurs par défaut quand aucune variable n’est fournie', () => {
    const env = validateEnv({});

    expect(env.PORT).toBe(3000);
    expect(env.NODE_ENV).toBe('development');
  });

  it('convertit PORT en nombre', () => {
    const env = validateEnv({ PORT: '8080' });

    expect(env.PORT).toBe(8080);
  });
});
