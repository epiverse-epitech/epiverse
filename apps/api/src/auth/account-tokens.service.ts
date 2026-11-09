import { Injectable } from '@nestjs/common';
import { auth_token_type, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { generateSessionToken, hashSessionToken } from './session-token';

// One-time tokens sent by email (auth_token). Like session tokens, they are
// random and only their hash is stored, so a database leak gives no working link.
@Injectable()
export class AccountTokens {
  constructor(private readonly prisma: PrismaService) {}

  // Creates a token and cancels the previous ones of the same type, so that
  // only the latest link sent to the user works.
  async issue(
    userId: number,
    type: auth_token_type,
    ttlMs: number,
  ): Promise<string> {
    const token = generateSessionToken();
    await this.prisma.$transaction([
      this.prisma.auth_token.updateMany({
        where: { user_id: userId, type, used_at: null },
        data: { used_at: new Date() },
      }),
      this.prisma.auth_token.create({
        data: {
          user_id: userId,
          type,
          token_hash: hashSessionToken(token),
          expires_at: new Date(Date.now() + ttlMs),
        },
      }),
    ]);
    return token;
  }

  // Marks the token as used and returns its account, or null when the token is
  // unknown, of another type, expired or already used. The update is conditional,
  // so two simultaneous requests cannot both use the same token.
  async consume(
    token: string,
    type: auth_token_type,
    client: Prisma.TransactionClient = this.prisma,
  ): Promise<number | null> {
    const tokenHash = hashSessionToken(token);
    const stored = await client.auth_token.findUnique({
      where: { token_hash: tokenHash },
      select: { user_id: true },
    });
    if (!stored) {
      return null;
    }
    const { count } = await client.auth_token.updateMany({
      where: {
        token_hash: tokenHash,
        type,
        used_at: null,
        expires_at: { gt: new Date() },
      },
      data: { used_at: new Date() },
    });
    return count === 1 ? stored.user_id : null;
  }
}
