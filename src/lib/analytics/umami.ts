type UmamiEventData = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: UmamiEventData) => void };
  }
}

export function trackEvent(name: string, data?: UmamiEventData) {
  if (typeof window === "undefined") return;
  window.umami?.track(name, data);
}

export function bucketCashflow(v: number): "positive" | "negative" | "neutral" {
  if (v > 20) return "positive";
  if (v < -20) return "negative";
  return "neutral";
}
