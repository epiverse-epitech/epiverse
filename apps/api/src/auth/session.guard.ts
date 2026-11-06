import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AccountDto } from './dto/account.dto';
import { hashSessionToken } from './session-token';
import { isOpenAccount } from './account-state';

type AuthenticatedRequest = Request & {
  account?: AccountDto;
  sessionId?: number;
};

// Protects a route with the session token sent as "Authorization: Bearer <token>".
// Every failure gets the same message, so a client cannot tell a missing token
// from an unknown, revoked or expired one, or one of a closed account.
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = readBearerToken(request);
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    // Only the hash is stored, so the lookup is done on the hash of the token.
    const session = await this.prisma.user_session.findUnique({
      where: { token_hash: hashSessionToken(token) },
      select: {
        id: true,
        revoked_at: true,
        expires_at: true,
        users: {
          select: {
            public_id: true,
            email: true,
            first_name: true,
            last_name: true,
            is_active: true,
            deleted_at: true,
          },
        },
      },
    });
    if (
      !session ||
      session.revoked_at ||
      session.expires_at <= new Date() ||
      !isOpenAccount(session.users)
    ) {
      throw new UnauthorizedException('Authentication required');
    }

    request.sessionId = session.id;
    request.account = {
      id: session.users.public_id,
      email: session.users.email,
      firstName: session.users.first_name,
      lastName: session.users.last_name,
    };
    return true;
  }
}

function readBearerToken(request: Request): string | undefined {
  const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
  return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
}

// Reads the account that SessionGuard attached to the request.
export const CurrentAccount = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AccountDto =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().account!,
);

// Reads the id of the session that SessionGuard checked.
export const CurrentSessionId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().sessionId!,
);
