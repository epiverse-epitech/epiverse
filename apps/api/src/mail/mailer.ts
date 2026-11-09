import { Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

export interface MailMessage {
  to: string;
  subject: string;
  // Plain text only: no HTML, so nothing from a user can be injected as markup.
  text: string;
}

// What the rest of the application depends on. Tests replace it with a fake.
export abstract class Mailer {
  abstract send(message: MailMessage): Promise<void>;
}

interface MailSettings {
  get(key: string): unknown;
}

export class SmtpMailer extends Mailer {
  private readonly transport: Transporter;
  private readonly from: string;

  constructor(settings: MailSettings) {
    super();
    const port = settings.get('SMTP_PORT') as number;
    const user = settings.get('SMTP_USER') as string | undefined;
    this.from = settings.get('MAIL_FROM') as string;
    this.transport = createTransport({
      host: settings.get('SMTP_HOST') as string,
      port,
      secure: port === 465,
      requireTLS: settings.get('SMTP_REQUIRE_TLS') as boolean,
      auth: user
        ? { user, pass: settings.get('SMTP_PASSWORD') as string }
        : undefined,
    });
  }

  async send(message: MailMessage): Promise<void> {
    await this.transport.sendMail({ ...message, from: this.from });
  }
}

// Development only: shows the email, so links can be tried without a server.
export class ConsoleMailer extends Mailer {
  private readonly logger = new Logger('Mail');

  send(message: MailMessage): Promise<void> {
    this.logger.log(`To ${message.to}: ${message.subject}\n${message.text}`);
    return Promise.resolve();
  }
}

// Production without SMTP settings: the API still starts, but no email leaves
// and its content is never logged, because links are secrets.
export class DisabledMailer extends Mailer {
  send(): Promise<void> {
    return Promise.reject(new Error('Email delivery is not configured'));
  }
}

export function createMailer(settings: MailSettings): Mailer {
  if (settings.get('SMTP_HOST')) {
    return new SmtpMailer(settings);
  }
  if (settings.get('NODE_ENV') === 'production') {
    new Logger('Mail').warn('SMTP_HOST is not set: no email will be sent');
    return new DisabledMailer();
  }
  return new ConsoleMailer();
}
