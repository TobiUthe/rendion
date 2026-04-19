import { ErgebnisEmptyState } from "@/components/results/ErgebnisEmptyState";
import { ErgebnisView } from "@/components/results/ErgebnisView";
import { decodeQuickParams } from "@/lib/calculator/url-params";
import { quickCalcKapitalanlage } from "@/lib/calculator/quick-calc";
import { mapResultToView } from "@/lib/calculator/mapResultToView";

export default async function ErgebnisPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string | string[] }>;
}) {
  const params = await searchParams;
  const input = decodeQuickParams(params);
  if (!input) return <ErgebnisEmptyState />;

  const result = quickCalcKapitalanlage(input);
  if (!result) return <ErgebnisEmptyState />;

  const view = mapResultToView(input, result);

  return <ErgebnisView view={view} input={input} kaufpreisfaktor={result.kaufpreisfaktor} />;
}
