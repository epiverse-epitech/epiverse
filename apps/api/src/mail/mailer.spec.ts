import { jest } from '@jest/globals';
import { Logger } from '@nestjs/common';
import {
  ConsoleMailer,
  createMailer,
  DisabledMailer,
  SmtpMailer,
} from './mailer';

const settings = (values: Record<string, unknown>) => ({
  get: (key: string) => values[key],
});

describe('createMailer', () => {
  it('uses SMTP as soon as a host is configured', () => {
    const mailer = createMailer(
      settings({
        NODE_ENV: 'production',
        SMTP_HOST: 'smtp.example.test',
        SMTP_PORT: 587,
        SMTP_REQUIRE_TLS: true,
        MAIL_FROM: 'EpiVerse <no-reply@example.test>',
      }),
    );

    expect(mailer).toBeInstanceOf(SmtpMailer);
  });

  it('prints emails to the console in development, to test links without a server', () => {
    expect(createMailer(settings({ NODE_ENV: 'development' }))).toBeInstanceOf(
      ConsoleMailer,
    );
  });

  it('never prints emails in production: links are secrets', async () => {
    const warn = jest
      .spyOn(Logger.prototype, 'warn')
      .mockImplementation(() => undefined);
    const log = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);

    const mailer = createMailer(settings({ NODE_ENV: 'production' }));

    expect(mailer).toBeInstanceOf(DisabledMailer);
    await expect(
      mailer.send({ to: 'a@b.test', subject: 's', text: 'secret-link' }),
    ).rejects.toThrow('not configured');
    expect(log).not.toHaveBeenCalled();
    warn.mockRestore();
    log.mockRestore();
  });
});
