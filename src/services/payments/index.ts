// Track A (A7). Stripe only in Phase 1; interface exists so Square is
// containable later.

export interface PaymentProvider {
  createConnectOnboardingUrl(salonId: string): Promise<{ url: string }>;
  createCheckoutLink(input: {
    salonId: string;
    appointmentId: string;
    amountCents: number;
    description: string;
  }): Promise<{ url: string; providerChargeId: string }>;
  refund(providerChargeId: string, amountCents?: number): Promise<{ ok: true }>;
}

export const paymentProvider: PaymentProvider = {
  async createConnectOnboardingUrl() {
    throw new Error('not implemented — A7');
  },
  async createCheckoutLink() {
    throw new Error('not implemented — A7');
  },
  async refund() {
    throw new Error('not implemented — A7');
  },
};
