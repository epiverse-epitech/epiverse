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

  it.each(['abc', '3000abc', ' 8080 ', '80.5', ''])(
    'refuse PORT = %j',
    (port) => {
      expect(() => validateEnv({ PORT: port })).toThrow(/PORT/);
    },
  );

  it.each(['0', '65536'])('refuse un PORT hors de 1-65535 : %s', (port) => {
    expect(() => validateEnv({ PORT: port })).toThrow(/PORT/);
  });

  it.each(['1', '65535'])('accepte les bornes de PORT : %s', (port) => {
    expect(validateEnv({ PORT: port }).PORT).toBe(Number(port));
  });

  it.each(['development', 'test', 'production'])(
    'accepte NODE_ENV = %s',
    (nodeEnv) => {
      expect(validateEnv({ NODE_ENV: nodeEnv }).NODE_ENV).toBe(nodeEnv);
    },
  );

  it('refuse un NODE_ENV inconnu', () => {
    expect(() => validateEnv({ NODE_ENV: 'prod' })).toThrow(/NODE_ENV/);
  });

  it('liste toutes les variables invalides dans une seule erreur', () => {
    expect(() => validateEnv({ PORT: 'abc', NODE_ENV: 'prod' })).toThrow(
      /PORT[\s\S]*NODE_ENV|NODE_ENV[\s\S]*PORT/,
    );
  });

  it('ne garde que les variables déclarées', () => {
    const env = validateEnv({ PORT: '8080', PATH: '/usr/bin' });

    expect(env).not.toHaveProperty('PATH');
  });
});
