import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { EnvironmentVariables } from '../config/env.validation';
import { PrismaService } from '../prisma/prisma.service';
import { AccountDto } from './dto/account.dto';
import { hashSessionToken } from './session-token';
import { isOpenAccount } from './account-state';

type AuthenticatedRequest = Request & {
  account?: AccountDto;
  sessionId?: number;
  userId?: number;
  cguAccepted?: boolean;
  roles?: string[];
  emailVerified?: boolean;
};

const ALLOW_PENDING_CGU_KEY = 'allowPendingCgu';

// Marks a route that stays available while the account has not accepted the
// current terms of use: reading the account, logging out, accepting the terms.
export const AllowPendingCgu = () => SetMetadata(ALLOW_PENDING_CGU_KEY, true);

// Protects a route with the session token sent as "Authorization: Bearer <token>".
// Every failure gets the same message, so a client cannot tell a missing token
// from an unknown, revoked or expired one, or one of a closed account.
// An account that has not accepted the current terms of use (CGU_VERSION)
// then gets 403 on every route not marked @AllowPendingCgu().
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly reflector: Reflector,
  ) {}

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
            id: true,
            public_id: true,
            email: true,
            first_name: true,
            last_name: true,
            is_active: true,
            deleted_at: true,
            email_verified_at: true,
            // Read in the same query: the acceptance of the current version, if any.
            user_cgu_acceptance: {
              where: {
                version: this.config.get('CGU_VERSION', { infer: true }),
              },
              select: { version: true },
            },
            user_role: { select: { role: { select: { name: true } } } },
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
    request.userId = session.users.id;
    request.cguAccepted = session.users.user_cgu_acceptance.length > 0;
    request.emailVerified = session.users.email_verified_at !== null;
    request.roles = session.users.user_role.map((r) => r.role.name).sort();
    request.account = {
      id: session.users.public_id,
      email: session.users.email,
      firstName: session.users.first_name,
      lastName: session.users.last_name,
    };

    const allowPendingCgu = this.reflector.getAllAndOverride<boolean>(
      ALLOW_PENDING_CGU_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!request.cguAccepted && !allowPendingCgu) {
      throw new ForbiddenException('The current terms of use must be accepted');
    }
    return true;
  }
}

function readBearerToken(request: Request): string | undefined {
  const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
  return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
}

const requestOf = (context: ExecutionContext): AuthenticatedRequest =>
  context.switchToHttp().getRequest<AuthenticatedRequest>();

// Reads the account that SessionGuard attached to the request.
export const CurrentAccount = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AccountDto =>
    requestOf(context).account!,
);

// Reads the id of the session that SessionGuard checked.
export const CurrentSessionId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number =>
    requestOf(context).sessionId!,
);

// Reads the internal id of the account. Never return it to the client.
export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number =>
    requestOf(context).userId!,
);

// Reads whether the account accepted the current terms of use.
export const CurrentCguAccepted = createParamDecorator(
  (_data: unknown, context: ExecutionContext): boolean =>
    requestOf(context).cguAccepted!,
);

// Reads the role names of the account (such as "student"), sorted.
export const CurrentRoles = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string[] =>
    requestOf(context).roles!,
);

// Reads whether the account confirmed its email address.
export const CurrentEmailVerified = createParamDecorator(
  (_data: unknown, context: ExecutionContext): boolean =>
    requestOf(context).emailVerified!,
);
