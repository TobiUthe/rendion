import * as d3 from "d3";

export const CHART_ANIMATION = {
  spring: {
    duration: 800,
    stagger: 50,
  },
  countUp: {
    duration: 600,
  },
  shouldAnimate: (): boolean =>
    typeof window !== "undefined"
      ? !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
};

export const ANIMATION = {
  duration: CHART_ANIMATION.spring.duration,
  staggerDelay: CHART_ANIMATION.spring.stagger,
} as const;

export function createTransition<
  GElement extends d3.BaseType,
  Datum,
  PElement extends d3.BaseType,
  PDatum,
>(
  selection: d3.Selection<GElement, Datum, PElement, PDatum>,
): d3.Selection<GElement, Datum, PElement, PDatum> | d3.Transition<GElement, Datum, PElement, PDatum> {
  if (!CHART_ANIMATION.shouldAnimate()) {
    return selection;
  }
  return selection.transition().duration(CHART_ANIMATION.spring.duration).ease(d3.easeCubicOut);
}
