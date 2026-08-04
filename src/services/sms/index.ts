// Track B (B4). Consent is enforced INSIDE send(), not at call sites.

export interface Messenger {
  send(msg: {
    salonId: string;
    toE164: string;
    body: string;
    idempotencyKey: string;
  }): Promise<{ providerMessageId: string }>;
}

export const messenger: Messenger = {
  async send() {
    throw new Error('not implemented — B4');
  },
};
