import { createHash, randomBytes } from 'node:crypto';

// 32 random bytes cannot be guessed, so a fast hash is enough to store them:
// Argon2 is only needed for low-entropy secrets such as passwords.
export function generateSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
