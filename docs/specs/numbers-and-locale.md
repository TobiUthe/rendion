# Numbers and Locale Spec

All number formatting in Rendion uses a single set of helpers in
[`src/lib/format.ts`](../../src/lib/format.ts).

---

## Locale rules

| Rule | Value |
|------|-------|
| Locale | `de-DE` |
| Thousands separator | `.` (dot) |
| Decimal separator | `,` (comma) |
| Euro symbol position | After value, separated by NBSP (`250.000 €`) |
| Percent symbol position | After value, separated by NBSP (`4,5 %`) |
| Negative values | Typographic minus U+2212 (`−`), not hyphen-minus (`-`) |

---

## Default decimal places

| Type | Decimals |
|------|----------|
| EUR | 0 (`250.000 €`) |
| % | 1 (`4,5 %`) |
| Factor (×) | 2 (`26,40×`) |
| Years | 0 (`15 Jahre`) |

All helpers accept an optional `decimals` override.

---

## Formatter surface

| Function | Produces | Example |
|----------|---------|---------|
| `formatEuro(value)` | `"250.000 €"` | Euro amounts, always includes symbol |
| `formatPercent(value)` | `"4,5 %"` | Percentages with NBSP before % |
| `formatFactor(value)` | `"26,40×"` | Price-to-rent or yield factors |
| `formatYears(value)` | `"15 Jahre"` | Loan terms |
| `formatCompact(value)` | `"1,2 Mio. €"` | Axis ticks, compact amounts |
| `formatDelta(value)` | `"+1.200 €"` / `"−400 €"` | Signed deltas with typographic minus |
| `formatNumber(value)` | `"1.234,56"` | Raw German number, no symbol |
| `liveFormatDE(raw)` | partial string | Live input display while typing |
| `parseDE(str)` | `number` | Parse a German-formatted string |

---

## Compact German abbreviations (axis ticks)

`formatCompact` uses German abbreviations:

| Magnitude | Abbreviation | Example |
|-----------|-------------|---------|
| 1 000 | Tsd. | `1,2 Tsd. €` |
| 1 000 000 | Mio. | `1,2 Mio. €` |
| 1 000 000 000 | Mrd. | `1,2 Mrd. €` |

---

## What not to do

- Do not use `Intl.NumberFormat` directly in components — call a `format.ts` helper.
- Do not use hyphen-minus (`-`) for negative display values — use `formatDelta` which
  emits U+2212.
- Do not inline `"de-DE"` locale string in components.
- Do not format inside D3 axis tick functions by hand — wrap `formatCompact`.
