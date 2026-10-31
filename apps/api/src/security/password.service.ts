import { Injectable } from '@nestjs/common';
import { hash } from '@node-rs/argon2';

// OWASP minimum for Argon2id: 19 MiB of memory, 2 iterations, 1 thread.
// Written explicitly so that a change of library defaults cannot weaken the hashes.
const HASH_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

@Injectable()
export class PasswordService {
  hash(password: string): Promise<string> {
    return hash(password, HASH_OPTIONS);
  }
}
