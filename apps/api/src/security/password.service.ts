import { Injectable, Logger } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';

// OWASP minimum for Argon2id: 19 MiB of memory, 2 iterations, 1 thread.
// Written explicitly so that a change of library defaults cannot weaken the hashes.
const HASH_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);
  hash(password: string): Promise<string> {
    return hash(password, HASH_OPTIONS);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    try {
      return await verify(hash, password);
    } catch {
      // An unreadable hash matches no password. The hash itself is never logged.
      this.logger.warn('A stored password hash could not be decoded');
      return false;
    }
  }
}
