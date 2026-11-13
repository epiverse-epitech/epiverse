import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';
import { emailLink } from '../mail/email-link';
import { Mailer } from '../mail/mailer';
import { PrismaService } from '../prisma/prisma.service';
import {
  EMAIL_REQUEST_ATTEMPTS,
  LoginAttempts,
  loginAttemptKey,
  TooManyAttemptsException,
} from '../security/login-attempts';
import { PasswordService } from '../security/password.service';
import { AccountTokens } from './account-tokens.service';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: AccountTokens,
    private readonly passwords: PasswordService,
    private readonly mailer: Mailer,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    private readonly loginAttempts: LoginAttempts,
    @Inject(EMAIL_REQUEST_ATTEMPTS)
    private readonly emailRequests: LoginAttempts,
  ) {}

  // The answer never depends on the account (FR-AUTH-004): unknown emails are
  // counted the same, and the lookup and the email happen after the response,
  // so neither the content nor the timing reveals which accounts exist.
  requestLink(email: string, clientIp: string): void {
    const retryAfterSeconds = this.emailRequests.start(
      `reset\n${clientIp}\n${email}`,
    );
    if (retryAfterSeconds > 0) {
      throw new TooManyAttemptsException(
        'Too many emails requested, try again later',
        retryAfterSeconds,
      );
    }

    this.sendLink(email).catch(() => {
      this.logger.error('A password reset email could not be sent');
    });
  }

  async reset(
    token: string,
    newPassword: string,
    clientIp: string,
  ): Promise<void> {
    const passwordHash = await this.passwords.hash(newPassword);

    // All or nothing: a used token always goes with a changed password and
    // revoked sessions.
    const email = await this.prisma.$transaction(async (tx) => {
      const userId = await this.tokens.consume(token, 'password_reset', tx);
      if (userId === null) {
        return null;
      }
      const { count } = await tx.users.updateMany({
        where: { id: userId, is_active: true, deleted_at: null },
        data: { password_hash: passwordHash, updated_at: new Date() },
      });
      if (count !== 1) {
        return null;
      }
      // The link reached the mailbox, so the address is confirmed too.
      await tx.users.updateMany({
        where: { id: userId, email_verified_at: null },
        data: { email_verified_at: new Date() },
      });
      // Whoever got into the account is signed out too.
      await tx.user_session.updateMany({
        where: { user_id: userId, revoked_at: null },
        data: { revoked_at: new Date() },
      });
      await tx.auth_token.updateMany({
        where: { user_id: userId, type: 'password_reset', used_at: null },
        data: { used_at: new Date() },
      });
      const user = await tx.users.findUniqueOrThrow({
        where: { id: userId },
        select: { email: true },
      });
      return user.email;
    });

    if (email === null) {
      throw new BadRequestException('This link is invalid or has expired');
    }

    this.loginAttempts.succeeded(loginAttemptKey(clientIp, email));
    this.sendNotice(email).catch(() => {
      this.logger.error('A password change notice could not be sent');
    });
  }

  private async sendLink(email: string): Promise<void> {
    const user = await this.prisma.users.findFirst({
      where: { email, is_active: true, deleted_at: null },
      select: { id: true },
    });
    if (!user) {
      return;
    }

    const ttlMinutes = this.config.get('PASSWORD_RESET_TTL_MINUTES', {
      infer: true,
    });
    const token = await this.tokens.issue(
      user.id,
      'password_reset',
      ttlMinutes * 60 * 1000,
    );
    const link = emailLink(
      this.config.get('WEB_BASE_URL', { infer: true }),
      'reset-password',
      token,
    );

    await this.mailer.send({
      to: email,
      subject: 'Réinitialisez votre mot de passe EpiVerse',
      text: [
        'Bonjour,',
        '',
        `Pour choisir un nouveau mot de passe, ouvrez ce lien, valable ${ttlMinutes} minutes et utilisable une seule fois :`,
        link,
        '',
        "Si vous n'avez rien demandé, ignorez ce message : votre mot de passe ne change pas.",
      ].join('\n'),
    });
    await this.tokens
      .cancelOlder(user.id, 'password_reset', token)
      .catch(() => {
        this.logger.error('Older reset links could not be cancelled');
      });
  }

  private async sendNotice(email: string): Promise<void> {
    await this.mailer.send({
      to: email,
      subject: 'Votre mot de passe EpiVerse a été modifié',
      text: [
        'Bonjour,',
        '',
        'Le mot de passe de votre compte EpiVerse vient de changer, et toutes vos sessions ont été fermées.',
        '',
        "Si vous n'êtes pas à l'origine de ce changement, demandez un nouveau lien depuis la page de connexion et prévenez l'équipe EpiVerse.",
      ].join('\n'),
    });
  }
}
