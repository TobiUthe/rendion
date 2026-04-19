// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS — Single source of truth for rendion.de
//
// Every design decision is documented here. globals.css,
// chart-config.ts, chart-utils.ts, and components all
// derive from these values.
// ═══════════════════════════════════════════════════════════

// ── PALETTES ────────────────────────────────────────────────
// 11 named palettes. Each has 50-900 (Stone has 950).
// Semantic aliases map existing Tailwind class names to these.

export const PALETTES = {
  sand: {
    50: "#faf8f5", 100: "#f5f1eb", 200: "#ebe5db", 300: "#ddd4c6",
    400: "#c9bba6", 500: "#b5a287", 600: "#9a8568", 700: "#7d6a51",
    800: "#5f5040", 900: "#413730",
  },
  stone: {
    50: "#f7f7f8", 100: "#ededef", 200: "#d9dadd", 300: "#bbbdc2",
    400: "#82848f", 500: "#6e7280", 600: "#565a66", 700: "#444853",
    800: "#383c44", 900: "#2d3239", 950: "#1c1e23",
  },
  forest: {
    50: "#f4f7f5", 100: "#e5ebe7", 200: "#c9d7cf", 300: "#a4baad",
    400: "#7a9a87", 500: "#5a7d67", 600: "#476352", 700: "#3a5143",
    800: "#304238", 900: "#28362f",
  },
  terra: {
    50: "#faf6f4", 100: "#f3ebe6", 200: "#e8d6cc", 300: "#d8b9a8",
    400: "#c59680", 500: "#b47a62", 600: "#a46652", 700: "#885445",
    800: "#6f463c", 900: "#5b3c34",
  },
  plum: {
    50: "#f9f7fa", 100: "#f1ecf4", 200: "#e1d6e8", 300: "#cab7d5",
    400: "#ab91ba", 500: "#8B6E9B", 600: "#745b82", 700: "#5f4a6a",
    800: "#4d3d56", 900: "#3e3147",
  },
  blush: {
    50: "#faf7f7", 100: "#f4ecee", 200: "#e9d7da", 300: "#d9b9bf",
    400: "#cf9ea5", 500: "#C4848B", 600: "#a86c74", 700: "#8b585f",
    800: "#72484e", 900: "#5c3b41",
  },
  honey: {
    50: "#faf8f4", 100: "#f4ede2", 200: "#e9dac6", 300: "#dac1a3",
    400: "#cfab86", 500: "#C4956A", 600: "#a87c56", 700: "#8b6547",
    800: "#71523b", 900: "#5b4230",
  },
  steel: {
    50: "#f6f7f9", 100: "#ebeef1", 200: "#d4dbe1", 300: "#b3bfc9",
    400: "#8899a5", 500: "#5B6E7C", 600: "#4b5b67", 700: "#3e4b55",
    800: "#343e46", 900: "#2a333a",
  },
  pine: {
    50: "#f0f9f5", 100: "#dcf0e6", 200: "#b6e1cd", 300: "#82ccaa",
    400: "#4fb384", 500: "#2E8C6A", 600: "#247356", 700: "#1e5f47",
    800: "#194d3b", 900: "#143f31",
  },
  sienna: {
    50: "#fdf5f3", 100: "#fae8e3", 200: "#f5cfc5", 300: "#ecab99",
    400: "#df7f66", 500: "#C05840", 600: "#a44834", 700: "#893b2b",
    800: "#6f3225", 900: "#5c2b21",
  },
  gold: {
    50: "#faf7ef", 100: "#f4ecd6", 200: "#e9d6ab", 300: "#dabb78",
    400: "#ce9f4c", 500: "#B8862D", 600: "#9c6f24", 700: "#815a1e",
    800: "#69491a", 900: "#563c16",
  },
} as const;

// ── SEMANTIC ALIASES ────────────────────────────────────────
// Maps existing Tailwind class families (primary-*, neutral-*, etc.)
// to named palettes. 400+ component files update automatically.

export const SEMANTIC = {
  primary: "steel",   // buttons, CTAs, focus rings, active states
  neutral: "stone",   // text, borders, backgrounds, disabled states
  accent:  "blush",   // secondary emphasis, upgrade prompts
  success: "pine",    // positive values, growth, profitable
  danger:  "sienna",  // negative values, losses, errors
  warning: "gold",    // caution, highlight, attention
  info:    "steel",   // informational, neutral emphasis
} as const;

// ── SURFACES ────────────────────────────────────────────────
// Three-tier background hierarchy + card surface.

export const SURFACES = {
  page:       PALETTES.sand[50],   // page background
  section:    PALETTES.sand[100],  // section/group background
  card:       "#FFFFFF",           // card surface
  cardRaised: "#FFFFFF",           // same in light, darker in dark mode
} as const;

// ── BORDERS ─────────────────────────────────────────────────

export const BORDERS = {
  default: PALETTES.sand[200],   // cards, rows, separators
  subtle:  PALETTES.sand[100],   // very light dividers
  medium:  PALETTES.stone[600],  // section dividers
  strong:  PALETTES.stone[800],  // high-contrast dividers
  accent:  PALETTES.steel[600],  // active/selected states
} as const;

// ── SHADOWS ─────────────────────────────────────────────────
// Warm shadow tone (sand-900 undertone).
// shadow-sm: static cards/inputs. shadow-md: hover.
// shadow-lg: dropdowns/tooltips. shadow-xl: modals/sheets.

export const SHADOWS = {
  sm:    "0 1px 3px rgba(65, 55, 48, 0.06), 0 1px 2px rgba(65, 55, 48, 0.04)",
  md:    "0 4px 8px rgba(65, 55, 48, 0.07), 0 2px 4px rgba(65, 55, 48, 0.04)",
  lg:    "0 8px 24px rgba(65, 55, 48, 0.08), 0 4px 8px rgba(65, 55, 48, 0.04)",
  xl:    "0 16px 48px rgba(65, 55, 48, 0.10), 0 8px 16px rgba(65, 55, 48, 0.05)",
  inner: "inset 0 1px 3px rgba(65, 55, 48, 0.06)",
  nav:   "0 0 12px -3px rgba(45, 50, 57, 0.08)",
} as const;

// ── BORDER RADIUS ───────────────────────────────────────────
// Two primary sizes. rounded-lg for components, rounded-xl for wrappers.

export const RADII = {
  component: "0.5rem",  // 8px — rounded-lg
  wrapper:   "0.75rem", // 12px — rounded-xl
  full:      "9999px",  // rounded-full
} as const;

// ── TYPOGRAPHY ──────────────────────────────────────────────

export const FONTS = {
  sans:    '"Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  display: '"Libre Baskerville", Georgia, serif',
  mono:    '"IBM Plex Mono", ui-monospace, "Cascadia Code", "Fira Code", monospace',
} as const;

export const HEADINGS = {
  h1: "font-display text-2xl font-bold leading-snug tracking-tight text-stone-800 md:text-3xl",
  h2: "font-display text-xl font-bold leading-snug text-stone-800",
  h3: "font-display text-lg font-semibold leading-snug text-stone-800",
  h4: "font-display text-base font-semibold text-stone-800",
  h5: "font-sans text-sm font-semibold text-stone-800",
} as const;

export const BODY = {
  default:      "font-sans text-sm text-stone-600",
  strong:       "font-sans text-sm font-semibold text-stone-600",
  caption:      "font-sans text-xs italic text-stone-400",
  sectionLabel: "font-sans text-xs font-semibold uppercase tracking-wider text-stone-600",
} as const;

export const DATA = {
  kpiLarge:        "font-mono text-2xl font-bold tabular-nums text-stone-800",
  kpiStandard:     "font-mono text-xl font-semibold tabular-nums text-stone-800",
  value:           "font-mono text-sm font-medium tabular-nums text-stone-800",
  axisLabel:       "font-mono text-xs tabular-nums text-stone-400",
  chartAnnotation: "font-sans text-xs italic text-stone-400",
  deltaBadge:      "font-mono text-sm font-medium tabular-nums",
} as const;

// ── FOCUS & ERROR STATES ────────────────────────────────────

export const FOCUS = {
  input:  "focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:outline-none",
  button: "focus-visible:outline-2 focus-visible:outline-steel-600 focus-visible:outline-offset-2",
  error:  "border-sienna-500 ring-2 ring-sienna-200",
} as const;

// ── BUTTONS ─────────────────────────────────────────────────
// Flat steel-600 primary. No gradient.

export const BUTTONS = {
  primary:     "rounded-lg border border-transparent bg-steel-600 px-3 py-2 text-base font-medium text-sand-50 shadow-sm hover:bg-steel-700 active:scale-[0.98]",
  secondary:   "rounded-lg border border-sand-300 bg-sand-50 px-3 py-2 text-base font-medium text-stone-800 shadow-sm hover:bg-sand-100",
  light:       "rounded-lg border border-transparent bg-sand-200 px-3 py-2 text-base font-medium text-stone-800 hover:bg-sand-300",
  ghost:       "rounded-lg border border-transparent bg-transparent px-3 py-2 text-base font-medium text-stone-800 hover:bg-sand-100",
  destructive: "rounded-lg border border-transparent bg-sienna-600 px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-sienna-700",
} as const;

// ── CARDS ───────────────────────────────────────────────────

export const CARDS = {
  base:        "rounded-lg border border-sand-200 bg-white shadow-sm",
  interactive: "rounded-lg border border-sand-200 bg-white shadow-sm transition-shadow hover:shadow-md",
  kpi:         "rounded-lg border border-l-[3px] border-sand-200 bg-white px-4 py-3 shadow-sm",
  chart:       "rounded-lg border border-sand-200 bg-white shadow-sm",
} as const;

// ── INPUTS ──────────────────────────────────────────────────

export const INPUTS = {
  base:   "h-11 w-full rounded-lg border border-sand-300 bg-white px-3 text-base text-stone-800 shadow-sm transition-colors placeholder:text-stone-400",
  select: "w-full rounded-lg border border-sand-300 bg-white px-3 py-2.5 text-sm text-stone-800 shadow-sm transition-colors",
  switchUnchecked: "bg-sand-200",
  switchChecked:   "bg-steel-500",
  radioUnchecked:  "border-sand-300",
  radioChecked:    "bg-steel-600",
} as const;

// ── BADGES ──────────────────────────────────────────────────

export const BADGES = {
  positive:  "rounded-lg border border-pine-200/30 bg-pine-50/50 text-pine-700",
  negative:  "rounded-lg border border-sienna-200/30 bg-sienna-50/50 text-sienna-700",
  highlight: "rounded-lg border border-gold-200/30 bg-gold-50/50 text-gold-700",
  neutral:   "rounded-lg border border-sand-200 bg-sand-100 text-stone-600",
  deltaPositive: "rounded bg-pine-50 px-1.5 py-0.5 font-mono text-xs font-medium text-pine-700",
  deltaNegative: "rounded bg-sienna-50 px-1.5 py-0.5 font-mono text-xs font-medium text-sienna-700",
  deltaNeutral:  "rounded bg-sand-100 px-1.5 py-0.5 font-mono text-xs font-medium text-stone-500",
} as const;

// ── TOOLTIPS & OVERLAYS ─────────────────────────────────────

export const OVERLAYS = {
  tooltip:  "rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 shadow-lg",
  modal:    "rounded-xl bg-white shadow-xl",
  backdrop: "bg-stone-950/50 backdrop-blur-sm",
  popover:  "rounded-lg border border-sand-200 bg-white/95 shadow-lg backdrop-blur-xl",
} as const;

// ── CHART ROLES ─────────────────────────────────────────────
// Data series → palette color mapping for all charts.

export const CHART_ROLES = {
  bank:  { color: PALETTES.forest[600], light: PALETTES.forest[200], label: "Immobilie" },
  peer1: { color: PALETTES.plum[500],   light: PALETTES.plum[200],   label: "Vergleich 1" },
  peer2: { color: PALETTES.steel[500],  light: PALETTES.steel[200],  label: "Vergleich 2" },
  peer3: { color: PALETTES.blush[500],  light: PALETTES.blush[200],  label: "Vergleich 3" },
  peer4: { color: PALETTES.honey[500],  light: PALETTES.honey[200],  label: "Vergleich 4" },
  peer5: { color: PALETTES.stone[400],  light: PALETTES.stone[200],  label: "Vergleich 5" },
} as const;

export const CHART_SEMANTIC = {
  positive:  PALETTES.pine[500],
  negative:  PALETTES.sienna[500],
  highlight: PALETTES.gold[500],
} as const;

export const CHART_CHROME = {
  axis:     PALETTES.stone[800],
  grid:     PALETTES.sand[200],
  muted:    PALETTES.stone[400],
  surface:  "#FFFFFF",
  zeroLine: PALETTES.stone[500],
} as const;

// ── CHART HEIGHTS ──────────────────────────────────────────
// Standard chart container heights. Use CSS vars (--chart-height-*)
// in Tailwind classes: h-[var(--chart-height-md)]

export const CHART_HEIGHTS = {
  sm: "250px",  // compact charts, skeletons
  md: "300px",  // standard charts
  lg: "400px",  // full-size charts
} as const;

// ── EXTENDED TEXT SCALE ────────────────────────────────────
// Fills gaps between Tailwind's built-in text-xs/sm/base steps.
// Use the corresponding Tailwind class: text-2xs, text-xs-plus, text-sm-plus

export const TEXT_SCALE = {
  "2xs":     "0.6875rem",   // 11px — data labels, axis labels
  "xs-plus": "0.8125rem",   // 13px — default body, table cells
  "sm-plus": "0.9375rem",   // 15px — input text, card body
} as const;

// ── INTERACTION ────────────────────────────────────────────

export const INTERACTION = {
  pressScale: "0.98",
} as const;

// ── BUTTON SIZES ───────────────────────────────────────────
// Standard button sizing. Combine with BUTTONS variant for full style.

export const BUTTON_SIZES = {
  xs: "px-2 py-1 text-xs",           // inline actions, tags
  sm: "px-3 py-2 text-sm",           // standard form buttons
  md: "px-4 py-2.5 text-sm-plus",    // primary actions
  lg: "px-6 py-3 text-sm-plus",      // hero CTAs, full-width
} as const;

// ── BADGE SIZES ────────────────────────────────────────────
// Standard badge sizing. Combine with BADGES color variant.

export const BADGE_SIZES = {
  xs: "rounded-full px-1.5 py-0.5 text-xs",   // inline status indicators
  sm: "rounded-full px-2 py-0.5 text-xs",      // standard badges
  md: "rounded-lg px-2.5 py-1 text-sm",        // prominent badges
} as const;

// ── SPACING HIERARCHY ──────────────────────────────────────
// Semantic spacing for consistent layout rhythm.

export const SPACING = {
  itemGap:      "gap-2",     // within a component (label to input, icon to text)
  componentGap: "gap-3",     // between related components (form fields)
  sectionGap:   "gap-6",     // between logical sections
  pageGap:      "gap-8",     // between major page sections
} as const;

// ── LAYOUT ─────────────────────────────────────────────────
// Containers, grid, and page templates are defined in globals.css.

export const CONTAINERS = {
  sm:   "40rem",   // 640px
  md:   "56rem",   // 896px
  lg:   "72rem",   // 1152px — default
  xl:   "80rem",   // 1280px
  full: "96rem",   // 1536px
} as const;

// ── BRAND ───────────────────────────────────────────────────

export const BRAND = {
  primary:     PALETTES.steel[600],
  primaryDark: PALETTES.steel[800],
  logo:        PALETTES.steel[600],
} as const;
