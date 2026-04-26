/**
 * German number formatting utilities.
 * - Thousands separator: dot (.)
 * - Decimal separator: comma (,)
 */

/**
 * Format rules (single source of truth for the app):
 * - Locale: de-DE (dot thousands, comma decimals)
 * - Euro symbol: AFTER value with NBSP, e.g. "250.000 €"
 * - Default decimals: EUR=0, %=1, factor=2, years=0
 * - All formatters accept an optional `decimals` override.
 * - Negative deltas use the typographic minus (U+2212), never hyphen-minus.
 * - formatDE returns "" for 0 (legacy live-input behaviour).
 *   formatEuro always renders a value, including "0 €".
 */

const deFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const deFormatterDecimal = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

// ── Memoised formatters ──────────────────────────────────────
// One Intl instance per (decimals) combination, created on demand.

const euroFormatters = new Map<number, Intl.NumberFormat>();
function getEuroFormatter(decimals: number): Intl.NumberFormat {
  if (!euroFormatters.has(decimals)) {
    euroFormatters.set(
      decimals,
      new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    );
  }
  return euroFormatters.get(decimals)!;
}

const percentFormatters = new Map<number, Intl.NumberFormat>();
function getPercentFormatter(decimals: number): Intl.NumberFormat {
  if (!percentFormatters.has(decimals)) {
    percentFormatters.set(
      decimals,
      new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    );
  }
  return percentFormatters.get(decimals)!;
}

const factorFormatters = new Map<number, Intl.NumberFormat>();
function getFactorFormatter(decimals: number): Intl.NumberFormat {
  if (!factorFormatters.has(decimals)) {
    factorFormatters.set(
      decimals,
      new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    );
  }
  return factorFormatters.get(decimals)!;
}

// NBSP — U+00A0
const NBSP = " ";
// Typographic minus — U+2212
const MINUS = "−";

// ── New unified formatters ────────────────────────────────────

/**
 * Format a euro amount without sign.
 * e.g. formatEuro(250000) → "250.000 €"
 */
export function formatEuro(value: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 0;
  return getEuroFormatter(decimals).format(Math.round(value)) + NBSP + "€";
}

/**
 * Format a percent value.
 * e.g. formatPercent(4.5) → "4,5 %"
 */
export function formatPercent(value: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 1;
  return getPercentFormatter(decimals).format(value) + NBSP + "%";
}

/**
 * Format a multiplier / factor.
 * e.g. formatFactor(22.3) → "22,30×"
 */
export function formatFactor(value: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 2;
  return getFactorFormatter(decimals).format(value) + "×";
}

/**
 * Format a year count.
 * e.g. formatYears(30) → "30 Jahre"
 */
export function formatYears(value: number): string {
  return getEuroFormatter(0).format(Math.round(value)) + NBSP + "Jahre";
}

/**
 * Compact German number abbreviation.
 * - >= 1 000 000 000 → "1,5 Mrd."
 * - >= 1 000 000     → "1,2 Mio."
 * - >= 1 000         → "850 Tsd."
 * - otherwise        → formatted integer
 *
 * Used for axis tick labels in charts.
 */
export function formatCompact(value: number, opts?: { decimals?: number }): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? MINUS : "";

  if (abs >= 1_000_000_000) {
    const decimals = opts?.decimals ?? 1;
    return sign + getFactorFormatter(decimals).format(abs / 1_000_000_000) + NBSP + "Mrd.";
  }
  if (abs >= 1_000_000) {
    const decimals = opts?.decimals ?? 1;
    return sign + getFactorFormatter(decimals).format(abs / 1_000_000) + NBSP + "Mio.";
  }
  if (abs >= 1_000) {
    const decimals = opts?.decimals ?? 0;
    return sign + getFactorFormatter(decimals).format(abs / 1_000) + NBSP + "Tsd.";
  }
  const decimals = opts?.decimals ?? 0;
  return sign + getEuroFormatter(decimals).format(abs);
}

/**
 * Format a signed delta with a given base formatter.
 * Positive values get a "+" prefix, negative values get the typographic minus (U+2212).
 * e.g. formatDelta(250000, formatEuro) → "+250.000 €"
 *      formatDelta(-520, formatEuro)   → "−520 €"
 */
export function formatDelta(value: number, formatter: (n: number) => string): string {
  if (value >= 0) {
    return "+" + formatter(value);
  }
  // Replace any leading hyphen-minus with the typographic minus.
  return formatter(value).replace(/^-/, MINUS);
}

/**
 * Format a plain German-locale number with no unit (useful for ratios like DSCR).
 * e.g. formatNumber(1.25, { decimals: 2 }) → "1,25"
 */
export function formatNumber(value: number, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? 0;
  return getEuroFormatter(decimals).format(value);
}

/** Format a number to German locale string (e.g. 1.234,56) */
export function formatDE(value: number, forceDecimals = false): string {
  if (value === 0) return "";
  return forceDecimals ? deFormatterDecimal.format(value) : deFormatter.format(value);
}

/** Parse a German-formatted string back to a number */
export function parseDE(input: string): number {
  if (!input.trim()) return 0;
  const cleaned = input.replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Live-format a German number string as the user types.
 * Adds thousand-separator dots while preserving the cursor position.
 */
export function liveFormatDE(
  raw: string,
  cursorPos: number,
): { formatted: string; cursor: number } {
  const cleaned = raw.replace(/[^\d,\-]/g, "");

  if (!cleaned || cleaned === "-") {
    return { formatted: "", cursor: 0 };
  }

  const parts = cleaned.split(",");
  const integerPart = parts[0] || "";
  const decimalPart = parts.length > 1 ? parts.slice(1).join("") : null;

  const stripped = integerPart.replace(/^(-?)0+(\d)/, "$1$2") || "0";

  const negative = stripped.startsWith("-");
  const digits = negative ? stripped.slice(1) : stripped;
  let withDots = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) {
      withDots += ".";
    }
    withDots += digits[i];
  }
  if (negative) withDots = "-" + withDots;

  const formatted = decimalPart !== null ? withDots + "," + decimalPart : withDots;

  const dotsBeforeCursorInRaw = (raw.slice(0, cursorPos).match(/\./g) || []).length;
  const cleanCursorPos = cursorPos - dotsBeforeCursorInRaw;

  let formattedCursor = 0;
  let cleanCount = 0;
  for (let i = 0; i < formatted.length && cleanCount < cleanCursorPos; i++) {
    formattedCursor = i + 1;
    if (formatted[i] !== ".") {
      cleanCount++;
    }
  }

  return { formatted, cursor: formattedCursor };
}
