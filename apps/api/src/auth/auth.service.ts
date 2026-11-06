import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../security/password.service';
import { AccountDto } from './dto/account.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';
import { SessionDto } from './dto/session.dto';
import { generateSessionToken, hashSessionToken } from './session-token';

@Injectable()
export class AuthService {
  // Verified when the email is unknown, so that both failures take the same
  // time and the response time does not reveal which emails have an account.
  private readonly unknownUserHash: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {
    this.unknownUserHash = passwords.hash('unknown-user-placeholder');
  }

  async register(dto: RegisterDto): Promise<AccountDto> {
    const passwordHash = await this.passwords.hash(dto.password);

    try {
      const account = await this.prisma.users.create({
        data: {
          email: dto.email,
          password_hash: passwordHash,
          first_name: dto.firstName,
          last_name: dto.lastName,
        },
        // Only public columns are read back, so the hash never leaves the database.
        select: {
          public_id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });

      return {
        id: account.public_id,
        email: account.email,
        firstName: account.first_name,
        lastName: account.last_name,
      };
    } catch (error) {
      // The unique index on lower(email) is the real guard: checking before
      // inserting would let two simultaneous requests both pass.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account already exists with this email',
        );
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<SessionDto> {
    const user = await this.prisma.users.findFirst({
      where: { email: dto.email },
      select: { id: true, password_hash: true },
    });

    const passwordMatches = await this.passwords.verify(
      dto.password,
      user?.password_hash ?? (await this.unknownUserHash),
    );

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = generateSessionToken();
    const ttlHours = this.config.get('SESSION_TTL_HOURS', { infer: true });
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

    await this.prisma.user_session.create({
      data: {
        user_id: user.id,
        token_hash: hashSessionToken(token),
        expires_at: expiresAt,
      },
    });

    return { token, expiresAt: expiresAt.toISOString() };
  }

  async logout(sessionId: number): Promise<void> {
    // The row is kept, marked as revoked, so the session history stays readable.
    await this.prisma.user_session.update({
      where: { id: sessionId },
      data: { revoked_at: new Date() },
    });
  }
}
