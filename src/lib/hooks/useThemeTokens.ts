"use client";

import { useEffect, useState } from "react";

export type ThemeTokens = {
  axis: string;
  grid: string;
  surface: string;
  border: string;
  textSecondary: string;
  textTertiary: string;
  // Chart roles — same in light & dark (palette-locked):
  chartPrimary: string;
  chartAccent: string;
  chartSuccess: string;
  chartDanger: string;
  chartWarning: string;
  chartIndigo: string;
  chartMoss: string;
  chartMauve: string;
};

function readTokens(): ThemeTokens {
  if (typeof window === "undefined") {
    // SSR fallback — light mode defaults
    return {
      axis: "#383c44",
      grid: "#ebe5db",
      surface: "#FFFFFF",
      border: "#ebe5db",
      textSecondary: "#565a66",
      textTertiary: "#82848f",
      chartPrimary: "#476352",
      chartAccent: "#8B6E9B",
      chartSuccess: "#2E8C6A",
      chartDanger: "#C05840",
      chartWarning: "#B8862D",
      chartIndigo: "#5B6E7C",
      chartMoss: "#C4848B",
      chartMauve: "#C4956A",
    };
  }
  const cs = getComputedStyle(document.documentElement);
  return {
    axis: cs.getPropertyValue("--color-chart-axis").trim() || "#383c44",
    grid: cs.getPropertyValue("--color-chart-grid").trim() || "#ebe5db",
    surface: cs.getPropertyValue("--color-surface").trim() || "#FFFFFF",
    border: cs.getPropertyValue("--color-border").trim() || "#ebe5db",
    textSecondary: cs.getPropertyValue("--color-text-secondary").trim() || "#565a66",
    textTertiary: cs.getPropertyValue("--color-text-tertiary").trim() || "#82848f",
    chartPrimary: cs.getPropertyValue("--color-chart-primary").trim() || "#476352",
    chartAccent: cs.getPropertyValue("--color-chart-accent").trim() || "#8B6E9B",
    chartSuccess: cs.getPropertyValue("--color-chart-success").trim() || "#2E8C6A",
    chartDanger: cs.getPropertyValue("--color-chart-danger").trim() || "#C05840",
    chartWarning: cs.getPropertyValue("--color-chart-warning").trim() || "#B8862D",
    chartIndigo: cs.getPropertyValue("--color-chart-indigo").trim() || "#5B6E7C",
    chartMoss: cs.getPropertyValue("--color-chart-moss").trim() || "#C4848B",
    chartMauve: cs.getPropertyValue("--color-chart-mauve").trim() || "#C4956A",
  };
}

export function useThemeTokens(): ThemeTokens {
  const [tokens, setTokens] = useState<ThemeTokens>(() => readTokens());

  useEffect(() => {
    const update = () => setTokens(readTokens());

    // Watch for data-theme attribute changes on <html>
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Also respond to OS-level prefers-color-scheme changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);

    return () => {
      obs.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return tokens;
}
