import type { QuickCalcInput } from "@/lib/schemas/calculator";

function toBase64Url(str: string): string {
  if (typeof btoa === "function") {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  if (typeof atob === "function") return atob(padded + pad);
  return Buffer.from(padded + pad, "base64").toString("utf-8");
}

export function encodeQuickParams(input: QuickCalcInput): string {
  const payload = JSON.stringify([input.kaufpreis, input.kaltmiete, input.eigenkapital]);
  return `d=${toBase64Url(payload)}`;
}

export function decodeQuickParams(
  searchParams: { d?: string | string[] } | undefined | null,
): QuickCalcInput | null {
  if (!searchParams) return null;
  const raw = searchParams.d;
  const d = Array.isArray(raw) ? raw[0] : raw;
  if (!d) return null;
  try {
    const json = fromBase64Url(d);
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length < 3) return null;
    const [kaufpreis, kaltmiete, eigenkapital] = parsed;
    if (
      typeof kaufpreis !== "number" ||
      typeof kaltmiete !== "number" ||
      typeof eigenkapital !== "number" ||
      kaufpreis <= 0 ||
      kaltmiete <= 0 ||
      eigenkapital < 0
    ) {
      return null;
    }
    return { kaufpreis, kaltmiete, eigenkapital };
  } catch {
    return null;
  }
}
