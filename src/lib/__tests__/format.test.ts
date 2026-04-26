import { describe, it, expect } from 'vitest';
import {
  formatEuro,
  formatPercent,
  formatFactor,
  formatYears,
  formatDelta,
  parseDE,
  formatDE,
} from '@/lib/format';

// U+00A0 — non-breaking space
const NBSP = ' ';
// U+2212 — typographic minus
const MINUS = '−';
// U+00D7 — multiplication sign
const TIMES = '×';

describe('formatEuro', () => {
  it('formatEuro(250_000) returns "250.000 €"', () => {
    expect(formatEuro(250_000)).toBe(`250.000${NBSP}€`);
  });

  it('formatEuro(0) returns "0 €"', () => {
    expect(formatEuro(0)).toBe(`0${NBSP}€`);
  });

  it('formatEuro(-1000) rounds and formats with NBSP before €', () => {
    const result = formatEuro(-1000);
    expect(result).toContain(NBSP);
    expect(result).toContain('€');
  });

  it('formatEuro applies Math.round to the value', () => {
    // 250_000.7 rounds to 250001
    expect(formatEuro(250_000.7)).toBe(`250.001${NBSP}€`);
  });
});

describe('formatPercent', () => {
  it('formatPercent(4.5) returns "4,5 %"', () => {
    expect(formatPercent(4.5)).toBe(`4,5${NBSP}%`);
  });

  it('formatPercent(0) returns "0,0 %"', () => {
    expect(formatPercent(0)).toBe(`0,0${NBSP}%`);
  });
});

describe('formatFactor', () => {
  it('formatFactor(26.4) ends with "×" (U+00D7)', () => {
    const result = formatFactor(26.4);
    expect(result[result.length - 1]).toBe(TIMES);
  });

  it('formatFactor(22.3) contains formatted number', () => {
    // default 2 decimals: "22,30×"
    expect(formatFactor(22.3)).toBe(`22,30${TIMES}`);
  });
});

describe('formatYears', () => {
  it('formatYears(15) ends with " Jahre"', () => {
    const result = formatYears(15);
    expect(result).toContain(`${NBSP}Jahre`);
    expect(result).toBe(`15${NBSP}Jahre`);
  });
});

describe('formatDelta', () => {
  it('negative delta starts with typographic minus U+2212', () => {
    const result = formatDelta(-82, formatEuro);
    // charCodeAt(0) should be U+2212 (8722)
    expect(result.charCodeAt(0)).toBe(0x2212);
  });

  it('positive delta starts with "+"', () => {
    const result = formatDelta(148, formatEuro);
    expect(result[0]).toBe('+');
  });

  it('negative delta does not use a hyphen-minus as the leading character', () => {
    const result = formatDelta(-500, formatEuro);
    expect(result[0]).not.toBe('-');
  });

  it('formatDelta(0, formatEuro) starts with "+" (zero is non-negative)', () => {
    const result = formatDelta(0, formatEuro);
    expect(result[0]).toBe('+');
  });
});

describe('parseDE', () => {
  it('parseDE("250.000") returns 250000', () => {
    expect(parseDE('250.000')).toBe(250_000);
  });

  it('parseDE("4,5") returns 4.5', () => {
    expect(parseDE('4,5')).toBe(4.5);
  });

  it('parseDE("") returns 0', () => {
    expect(parseDE('')).toBe(0);
  });

  it('parseDE("1.234,56") returns 1234.56', () => {
    expect(parseDE('1.234,56')).toBeCloseTo(1234.56, 5);
  });
});

describe('formatDE', () => {
  it('formatDE(0) returns empty string (legacy live-input behaviour)', () => {
    expect(formatDE(0)).toBe('');
  });

  it('formatDE(1234) returns a non-empty string', () => {
    expect(formatDE(1234).length).toBeGreaterThan(0);
  });
});
