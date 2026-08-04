import { describe, expect, it } from 'vitest';
import { resolvePriceCents } from './index';

describe('resolvePriceCents', () => {
  it('returns the base price with no modifiers', () => {
    expect(resolvePriceCents({ basePriceCents: 8500 })).toBe(8500);
  });

  it('stays integer cents', () => {
    expect(Number.isInteger(resolvePriceCents({ basePriceCents: 1999 }))).toBe(true);
  });
});
