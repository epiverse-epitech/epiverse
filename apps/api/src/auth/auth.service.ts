import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../security/password.service';
import { AccountDto } from './dto/account.dto';
import { CguDto } from './dto/cgu.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';
import { SessionDto } from './dto/session.dto';
import { generateSessionToken, hashSessionToken } from './session-token';
import { isOpenAccount } from './account-state';
import { EmailVerificationService } from './email-verification.service';
import { Mailer } from '../mail/mailer';
import {
  EMAIL_REQUEST_ATTEMPTS,
  LoginAttempts,
  loginAttemptKey,
  TooManyLoginFailuresException,
} from '../security/login-attempts';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // Verified when the email is unknown, so that both failures take the same
  // time and the response time does not reveal which emails have an account.
  private readonly unknownUserHash: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly loginAttempts: LoginAttempts,
    private readonly emailVerification: EmailVerificationService,
    private readonly mailer: Mailer,
    @Inject(EMAIL_REQUEST_ATTEMPTS)
    private readonly emailRequests: LoginAttempts,
  ) {
    this.unknownUserHash = passwords.hash('unknown-user-placeholder');
  }

  currentCgu(): CguDto {
    return { version: this.config.get('CGU_VERSION', { infer: true }) };
  }

  // Returns the version when it is the current one, otherwise refuses it.
  private checkCurrentCgu(version: string): string {
    const current = this.currentCgu().version;
    if (version !== current) {
      throw new BadRequestException(
        'The terms of use have changed: accept the current version',
      );
    }
    return current;
  }

  // Records the acceptance of the current terms of use by an existing account.
  // Accepting a version already accepted keeps its first date.
  async acceptCgu(userId: number, version: string): Promise<void> {
    const current = this.checkCurrentCgu(version);
    await this.prisma.user_cgu_acceptance.upsert({
      where: { user_id_version: { user_id: userId, version: current } },
      create: { user_id: userId, version: current },
      update: {},
    });
  }

  async register(dto: RegisterDto): Promise<AccountDto> {
    // The terms may have changed while the user was reading them: only the
    // current version can be accepted.
    const cguVersion = this.checkCurrentCgu(dto.cguVersion);

    const passwordHash = await this.passwords.hash(dto.password);

    try {
      const account = await this.prisma.users.create({
        data: {
          email: dto.email,
          password_hash: passwordHash,
          first_name: dto.firstName,
          last_name: dto.lastName,
          // Created in the same statement as the account, so an account never
          // exists without its recorded acceptance of the terms of use.
          user_cgu_acceptance: {
            create: { version: cguVersion },
          },
        },
        // Only public columns are read back, so the hash never leaves the database.
        select: {
          id: true,
          public_id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });

      this.emailVerification.sendInBackground(account.id, account.email);

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
        this.noticeExistingAccount(dto.email).catch(() => {
          this.logger.error('A registration notice could not be sent');
        });
        throw new ConflictException(
          'An account already exists with this email',
        );
      }
      throw error;
    }
  }

  // Tells the owner of an address already in use that someone tried to
  // register with it. The 409 already says the address is taken, so this
  // reveals nothing more. Nothing chosen by that person goes into the text,
  // and notices to one address are limited, so nobody can flood a mailbox.
  private async noticeExistingAccount(email: string): Promise<void> {
    if (this.emailRequests.start(`notice\n${email}`) > 0) {
      return;
    }
    const owner = await this.prisma.users.findFirst({
      where: { email, is_active: true, deleted_at: null },
      select: { id: true },
    });
    if (!owner) {
      return;
    }
    await this.mailer.send({
      to: email,
      subject: 'Un compte EpiVerse existe déjà avec cette adresse',
      text: [
        'Bonjour,',
        '',
        "Quelqu'un vient d'essayer de créer un compte EpiVerse avec votre adresse e-mail, qui en a déjà un.",
        '',
        "Si c'était vous, connectez-vous avec votre mot de passe, ou utilisez « Mot de passe oublié » sur la page de connexion.",
        "Si ce n'était pas vous, vous pouvez ignorer ce message : votre compte n'a pas changé.",
      ].join('\n'),
    });
  }

  // clientIp is the address seen through the trusted proxies (TRUST_PROXY_HOPS).
  async login(dto: LoginDto, clientIp: string): Promise<SessionDto> {
    // Unknown emails are counted too, so a 429 does not reveal which exist.
    const attemptKey = loginAttemptKey(clientIp, dto.email);
    const retryAfterSeconds = this.loginAttempts.start(attemptKey);
    if (retryAfterSeconds > 0) {
      throw new TooManyLoginFailuresException(retryAfterSeconds);
    }

    const user = await this.prisma.users.findFirst({
      where: { email: dto.email },
      select: {
        id: true,
        password_hash: true,
        is_active: true,
        deleted_at: true,
      },
    });

    const passwordMatches = await this.passwords.verify(
      dto.password,
      user?.password_hash ?? (await this.unknownUserHash),
    );

    // A deactivated or deleted account gets the same answer as a wrong
    // password, so the response does not reveal the state of an account.
    if (!user || !passwordMatches || !isOpenAccount(user)) {
      throw new UnauthorizedException('Invalid email or password');
    }
    this.loginAttempts.succeeded(attemptKey);

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
