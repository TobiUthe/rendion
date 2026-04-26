import { describe, it, expect } from 'vitest';
import { encodeQuickParams, decodeQuickParams } from '@/lib/calculator/url-params';

describe('encodeQuickParams / decodeQuickParams round-trip', () => {
  it('round-trip preserves kaufpreis, kaltmiete, eigenkapital', () => {
    const input = { kaufpreis: 350_000, kaltmiete: 1_200, eigenkapital: 80_000 };
    const encoded = encodeQuickParams(input);
    // encodeQuickParams returns "d=<base64url>" so wrap it for decodeQuickParams
    const d = encoded.replace(/^d=/, '');
    const result = decodeQuickParams({ d });
    expect(result).not.toBeNull();
    expect(result!.kaufpreis).toBe(350_000);
    expect(result!.kaltmiete).toBe(1_200);
    expect(result!.eigenkapital).toBe(80_000);
  });

  it('decodeQuickParams returns full QuickCalcInput (not just 3 fields)', () => {
    const input = { kaufpreis: 200_000, kaltmiete: 800, eigenkapital: 0 };
    const d = encodeQuickParams(input).replace(/^d=/, '');
    const result = decodeQuickParams({ d });
    // withDefaults populates zinssatzPa and projectionYears etc.
    expect(result).not.toBeNull();
    expect(typeof result!.zinssatzPa).toBe('number');
    expect(typeof result!.projectionYears).toBe('number');
  });

  it('returns null when kaufpreis <= 0', () => {
    const input = { kaufpreis: 0, kaltmiete: 800, eigenkapital: 0 };
    const d = encodeQuickParams(input).replace(/^d=/, '');
    expect(decodeQuickParams({ d })).toBeNull();
  });

  it('returns null when kaltmiete <= 0', () => {
    const input = { kaufpreis: 200_000, kaltmiete: -1, eigenkapital: 0 };
    const d = encodeQuickParams(input).replace(/^d=/, '');
    expect(decodeQuickParams({ d })).toBeNull();
  });

  it('returns null on malformed base64', () => {
    expect(decodeQuickParams({ d: '!!!not-base64!!!' })).toBeNull();
  });

  it('returns null when searchParams is null', () => {
    expect(decodeQuickParams(null)).toBeNull();
  });

  it('returns null when d is missing', () => {
    expect(decodeQuickParams({})).toBeNull();
  });

  it('handles array d — uses first element', () => {
    const input = { kaufpreis: 150_000, kaltmiete: 600, eigenkapital: 30_000 };
    const d = encodeQuickParams(input).replace(/^d=/, '');
    const result = decodeQuickParams({ d: [d, 'other-value'] });
    expect(result).not.toBeNull();
    expect(result!.kaufpreis).toBe(150_000);
  });
});
