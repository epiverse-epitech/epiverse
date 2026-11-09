import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';
import { Mailer } from '../mail/mailer';
import { PrismaService } from '../prisma/prisma.service';
import {
  EMAIL_REQUEST_ATTEMPTS,
  LoginAttempts,
  TooManyAttemptsException,
} from '../security/login-attempts';
import { AccountTokens } from './account-tokens.service';

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: AccountTokens,
    private readonly mailer: Mailer,
    private readonly config: ConfigService<EnvironmentVariables, true>,
    @Inject(EMAIL_REQUEST_ATTEMPTS)
    private readonly emailRequests: LoginAttempts,
  ) {}

  // Not awaited by callers: the response does not depend on the mail server.
  // The log names no address or link, which are personal data and a secret.
  sendInBackground(userId: number, email: string): void {
    this.send(userId, email).catch(() => {
      this.logger.error('A verification email could not be sent');
    });
  }

  async resend(userId: number): Promise<void> {
    // Per account: registering someone else's address must not let anyone
    // flood that mailbox.
    const retryAfterSeconds = this.emailRequests.start(`verify\n${userId}`);
    if (retryAfterSeconds > 0) {
      throw new TooManyAttemptsException(
        'Too many emails requested, try again later',
        retryAfterSeconds,
      );
    }

    const user = await this.prisma.users.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true, email_verified_at: true },
    });
    if (!user.email_verified_at) {
      this.sendInBackground(userId, user.email);
    }
  }

  async verify(token: string): Promise<void> {
    const userId = await this.tokens.consume(token, 'email_verification');
    // A closed account gets the same answer as a bad link.
    const { count } = await this.prisma.users.updateMany({
      where: { id: userId ?? -1, is_active: true, deleted_at: null },
      data: { email_verified_at: new Date() },
    });
    if (count !== 1) {
      throw new BadRequestException('This link is invalid or has expired');
    }
  }

  private async send(userId: number, email: string): Promise<void> {
    const ttlHours = this.config.get('EMAIL_VERIFICATION_TTL_HOURS', {
      infer: true,
    });
    const token = await this.tokens.issue(
      userId,
      'email_verification',
      ttlHours * 60 * 60 * 1000,
    );
    const baseUrl = this.config
      .get('WEB_BASE_URL', { infer: true })
      .replace(/\/+$/, '');

    // The token is in the fragment: browsers never send it to any server, so
    // it stays out of access logs and Referer headers.
    // No name in the text: anyone can register with someone else's address,
    // and a chosen name must not put their words in an email to that person.
    await this.mailer.send({
      to: email,
      subject: 'Confirmez votre adresse e-mail EpiVerse',
      text: [
        'Bonjour,',
        '',
        `Pour confirmer votre adresse e-mail sur EpiVerse, ouvrez ce lien, valable ${ttlHours} heures :`,
        `${baseUrl}/verify-email#token=${token}`,
        '',
        "Si vous n'avez pas créé de compte, ignorez ce message.",
      ].join('\n'),
    });
  }
}
