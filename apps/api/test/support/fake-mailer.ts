import { setTimeout as sleep } from 'node:timers/promises';
import { MailMessage, Mailer } from '../../src/mail/mailer';

// Keeps messages in memory, so tests never need an SMTP server.
export class FakeMailer extends Mailer {
  readonly sent: MailMessage[] = [];
  failing = false;

  send(message: MailMessage): Promise<void> {
    if (this.failing) {
      return Promise.reject(new Error('SMTP unavailable'));
    }
    this.sent.push(message);
    return Promise.resolve();
  }

  // Emails leave in the background, after the response: waits for one to arrive.
  async waitFor(to: string, count = 1): Promise<MailMessage> {
    for (let i = 0; i < 100; i++) {
      const received = this.sent.filter((m) => m.to === to);
      if (received.length >= count) {
        return received[count - 1];
      }
      await sleep(20);
    }
    throw new Error(`No email number ${count} received for ${to}`);
  }

  countFor(to: string): number {
    return this.sent.filter((m) => m.to === to).length;
  }
}

// Reads the token out of a link such as https://web/verify-email#token=abc.
export function tokenIn(message: MailMessage): string {
  const match = /#token=([A-Za-z0-9_-]+)/.exec(message.text);
  if (!match) {
    throw new Error('No link with a token in this email');
  }
  return match[1];
}
