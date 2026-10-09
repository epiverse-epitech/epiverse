import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('applique les valeurs par défaut quand aucune variable n’est fournie', () => {
    const env = validateEnv({});

    expect(env.PORT).toBe(3000);
    expect(env.NODE_ENV).toBe('development');
  });
});
