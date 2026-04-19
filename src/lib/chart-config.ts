import { CHART_ROLES, CHART_SEMANTIC, CHART_CHROME } from "./design-tokens";

export const CHART_COLORS = {
  primary: CHART_ROLES.bank.color,
  primaryLight: CHART_ROLES.bank.light,
  success: CHART_SEMANTIC.positive,
  warning: CHART_SEMANTIC.highlight,
  danger: CHART_SEMANTIC.negative,
  info: CHART_ROLES.peer2.color,
  muted: CHART_CHROME.muted,
  grid: CHART_CHROME.grid,
  axis: CHART_CHROME.axis,
  secondary: CHART_ROLES.peer2.color,
  positive: CHART_SEMANTIC.positive,
  negative: CHART_SEMANTIC.negative,
  neutral: CHART_CHROME.muted,
  text: CHART_CHROME.axis,
  textMuted: CHART_CHROME.muted,
  surface: CHART_CHROME.surface,
} as const;

export const DONUT_COLORS = [
  CHART_ROLES.bank.color,
  CHART_ROLES.peer1.color,
  CHART_SEMANTIC.highlight,
  CHART_ROLES.peer2.color,
  CHART_SEMANTIC.negative,
] as const;

export function formatAxisK(value: number): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(".", ",")}M`;
  }
  return `${(value / 1000).toFixed(0)}k`;
}

export const CHART_MARGIN = {
  top: 10,
  right: 16,
  left: 0,
  bottom: 0,
} as const;
