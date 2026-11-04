import { validateEnv } from './env.validation';

const baseEnv = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/epiverse',
};

describe('validateEnv', () => {
  it('applies defaults when no variable is provided', () => {
    const env = validateEnv({ ...baseEnv });

    expect(env.PORT).toBe(3000);
    expect(env.NODE_ENV).toBe('development');
  });

  it('converts PORT to a number', () => {
    const env = validateEnv({ ...baseEnv, PORT: '8080' });

    expect(env.PORT).toBe(8080);
  });

  it.each(['abc', '3000abc', ' 8080 ', '80.5', ''])(
    'rejects PORT = %j',
    (port) => {
      expect(() => validateEnv({ ...baseEnv, PORT: port })).toThrow(/PORT/);
    },
  );

  it('requires DATABASE_URL', () => {
    expect(() => validateEnv({})).toThrow(/DATABASE_URL/);
  });

  it.each(['not-a-url', 'mysql://user@localhost/db', 'http://localhost'])(
    'rejects DATABASE_URL = %s',
    (url) => {
      expect(() => validateEnv({ DATABASE_URL: url })).toThrow(/DATABASE_URL/);
    },
  );

  it('accepts a PostgreSQL DATABASE_URL', () => {
    expect(validateEnv(baseEnv).DATABASE_URL).toBe(baseEnv.DATABASE_URL);
  });

  it.each(['0', '65536'])('rejects a PORT outside 1-65535: %s', (port) => {
    expect(() => validateEnv({ ...baseEnv, PORT: port })).toThrow(/PORT/);
  });

  it.each(['1', '65535'])('accepts PORT boundaries: %s', (port) => {
    expect(validateEnv({ ...baseEnv, PORT: port }).PORT).toBe(Number(port));
  });

  it.each(['development', 'test', 'production'])(
    'accepts NODE_ENV = %s',
    (nodeEnv) => {
      expect(validateEnv({ ...baseEnv, NODE_ENV: nodeEnv }).NODE_ENV).toBe(
        nodeEnv,
      );
    },
  );

  it('rejects an unknown NODE_ENV', () => {
    expect(() => validateEnv({ ...baseEnv, NODE_ENV: 'prod' })).toThrow(
      /NODE_ENV/,
    );
  });

  it('lists every invalid variable in a single error', () => {
    expect(() =>
      validateEnv({ ...baseEnv, PORT: 'abc', NODE_ENV: 'prod' }),
    ).toThrow(/PORT[\s\S]*NODE_ENV|NODE_ENV[\s\S]*PORT/);
  });

  it('keeps only declared variables', () => {
    const env = validateEnv({ ...baseEnv, PORT: '8080', PATH: '/usr/bin' });

    expect(env).not.toHaveProperty('PATH');
  });
});
