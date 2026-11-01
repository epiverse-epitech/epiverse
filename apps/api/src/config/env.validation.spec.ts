import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('applies defaults when no variable is provided', () => {
    const env = validateEnv({});

    expect(env.PORT).toBe(3000);
    expect(env.NODE_ENV).toBe('development');
  });

  it('converts PORT to a number', () => {
    const env = validateEnv({ PORT: '8080' });

    expect(env.PORT).toBe(8080);
  });

  it.each(['abc', '3000abc', ' 8080 ', '80.5', ''])(
    'rejects PORT = %j',
    (port) => {
      expect(() => validateEnv({ PORT: port })).toThrow(/PORT/);
    },
  );

  it.each(['0', '65536'])('rejects a PORT outside 1-65535: %s', (port) => {
    expect(() => validateEnv({ PORT: port })).toThrow(/PORT/);
  });

  it.each(['1', '65535'])('accepts PORT boundaries: %s', (port) => {
    expect(validateEnv({ PORT: port }).PORT).toBe(Number(port));
  });

  it.each(['development', 'test', 'production'])(
    'accepts NODE_ENV = %s',
    (nodeEnv) => {
      expect(validateEnv({ NODE_ENV: nodeEnv }).NODE_ENV).toBe(nodeEnv);
    },
  );

  it('rejects an unknown NODE_ENV', () => {
    expect(() => validateEnv({ NODE_ENV: 'prod' })).toThrow(/NODE_ENV/);
  });

  it('lists every invalid variable in a single error', () => {
    expect(() => validateEnv({ PORT: 'abc', NODE_ENV: 'prod' })).toThrow(
      /PORT[\s\S]*NODE_ENV|NODE_ENV[\s\S]*PORT/,
    );
  });

  it('keeps only declared variables', () => {
    const env = validateEnv({ PORT: '8080', PATH: '/usr/bin' });

    expect(env).not.toHaveProperty('PATH');
  });

  it('applies rate limit defaults', () => {
    const env = validateEnv({});

    expect(env.RATE_LIMIT_TTL_SECONDS).toBe(60);
    expect(env.RATE_LIMIT_MAX).toBe(100);
    expect(env.AUTH_RATE_LIMIT_MAX).toBe(5);
  });

  describe.each([
    'RATE_LIMIT_TTL_SECONDS',
    'RATE_LIMIT_MAX',
    'AUTH_RATE_LIMIT_MAX',
  ])('%s', (name) => {
    it('converts the value to a number', () => {
      const env = validateEnv({ [name]: '10' });

      expect(env[name as keyof typeof env]).toBe(10);
    });

    it.each(['0', 'abc', '1.5', ''])('rejects %j', (value) => {
      expect(() => validateEnv({ [name]: value })).toThrow(name);
    });
  });
});
