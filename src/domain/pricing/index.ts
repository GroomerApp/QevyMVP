// Track A (A2). Pure. Money is integer cents, always.

export type PricingInput = {
  basePriceCents: number;
  // Hooks for size/breed modifiers later.
  petSize?: string | null;
};

export function resolvePriceCents(input: PricingInput): number {
  return input.basePriceCents;
}
