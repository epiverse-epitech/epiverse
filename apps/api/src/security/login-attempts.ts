import { HttpException, HttpStatus } from '@nestjs/common';

export interface LoginAttemptsOptions {
  maxFailures: number;
  windowMs: number;
  now?: () => number;
}

interface Counter {
  failures: number;
  resetAt: number;
}

// Counts failed logins per key (account and address) in a fixed window.
// Counters live in the memory of the process, like the address limit: a
// restart resets them and several instances do not share them.
export class LoginAttempts {
  private readonly counters = new Map<string, Counter>();
  private readonly maxFailures: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private nextSweepAt: number;

  constructor(options: LoginAttemptsOptions) {
    this.maxFailures = options.maxFailures;
    this.windowMs = options.windowMs;
    this.now = options.now ?? Date.now;
    this.nextSweepAt = this.now() + this.windowMs;
  }

  // Called before the password is checked. Returns 0 when the attempt may go
  // on, otherwise the seconds left before the key is unblocked.
  // The attempt is counted as a failure right away and forgotten on success:
  // counting only after the slow password check would let many parallel
  // requests pass before the first failure is recorded.
  start(key: string): number {
    const now = this.now();
    this.sweep(now);

    let counter = this.counters.get(key);
    if (!counter || counter.resetAt <= now) {
      counter = { failures: 0, resetAt: now + this.windowMs };
      this.counters.set(key, counter);
    }

    if (counter.failures >= this.maxFailures) {
      return Math.ceil((counter.resetAt - now) / 1000);
    }

    counter.failures++;
    return 0;
  }

  succeeded(key: string): void {
    this.counters.delete(key);
  }

  get size(): number {
    return this.counters.size;
  }

  // Drops expired counters once per window, so that keys an attacker makes
  // up (unknown emails) do not fill the memory.
  private sweep(now: number): void {
    if (now < this.nextSweepAt) {
      return;
    }
    for (const [key, counter] of this.counters) {
      if (counter.resetAt <= now) {
        this.counters.delete(key);
      }
    }
    this.nextSweepAt = now + this.windowMs;
  }
}

export class TooManyLoginFailuresException extends HttpException {
  constructor(readonly retryAfterSeconds: number) {
    super(
      'Too many failed login attempts, try again later',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
