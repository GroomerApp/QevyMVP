// Track B (B4). Resend + React Email.
import type { ReactElement } from 'react';

export interface Mailer {
  send(msg: {
    salonId: string;
    to: string;
    subject: string;
    react: ReactElement;
    idempotencyKey: string;
  }): Promise<{ providerMessageId: string }>;
}

export const mailer: Mailer = {
  async send() {
    throw new Error('not implemented — B4');
  },
};
