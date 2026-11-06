import { LoginAttempts } from './login-attempts';

const MINUTE = 60_000;

describe('LoginAttempts', () => {
  let now: number;
  let attempts: LoginAttempts;

  beforeEach(() => {
    now = 0;
    attempts = new LoginAttempts({
      maxFailures: 3,
      windowMs: 15 * MINUTE,
      now: () => now,
    });
  });

  const failTimes = (key: string, times: number) => {
    for (let i = 0; i < times; i++) {
      attempts.start(key);
    }
  };

  it('lets attempts through until the limit is reached', () => {
    failTimes('ada', 2);

    expect(attempts.start('ada')).toBe(0);
  });

  it('blocks once the limit is reached, until the window ends', () => {
    failTimes('ada', 3);

    now = 5 * MINUTE;
    expect(attempts.start('ada')).toBe(10 * 60);

    now = 15 * MINUTE;
    expect(attempts.start('ada')).toBe(0);
  });

  it('counts each key on its own', () => {
    failTimes('ada', 3);

    expect(attempts.start('grace')).toBe(0);
  });

  it('forgets the failures of a key after a success', () => {
    failTimes('ada', 2);
    attempts.start('ada');
    attempts.succeeded('ada');

    failTimes('ada', 2);
    expect(attempts.start('ada')).toBe(0);
  });

  it('drops expired keys, so memory does not grow without end', () => {
    failTimes('ada', 1);
    failTimes('grace', 1);

    now = 15 * MINUTE;
    attempts.start('alan');

    expect(attempts.size).toBe(1);
  });
});
