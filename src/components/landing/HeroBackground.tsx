/**
 * HeroBackground
 *
 * Full-viewport-width ambient colour layer behind the hero section.
 *
 * The parent section sits inside `container-xl page-px`, so `absolute inset-0`
 * would clip the background to the padded container box and create a hard
 * vertical edge at the page-padding boundary. We break out of that constraint
 * with `left-1/2 -translate-x-1/2 w-screen`, which anchors the element to the
 * horizontal viewport centre regardless of the container it lives in.
 *
 * Blobs are positioned in viewport-relative terms (vw units for horizontal
 * spread) so "off-screen left/right" means genuinely beyond the visible edge,
 * not just beyond the container edge. No outer mask is applied — each blob
 * already fades to transparent at its own edge via the radial gradient, so
 * there is no sharp boundary to clip.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        // Break out of the padded container to span full viewport width.
        // height stays relative to the section via inset-0 (top:0 / bottom:0).
        left: "50%",
        right: "auto",
        width: "100vw",
        transform: "translateX(-50%)",
      }}
    >
      {/* Blush — upper left, well off the visible edge */}
      <div
        className="absolute blur-3xl"
        style={{
          top: "-10%",
          left: "-10vw",
          width: "55vw",
          height: "120%",
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(196,132,139,0.14) 0%, rgba(196,132,139,0) 65%)",
        }}
      />

      {/* Forest — upper right */}
      <div
        className="absolute blur-3xl"
        style={{
          top: "0%",
          right: "-8vw",
          width: "50vw",
          height: "100%",
          background:
            "radial-gradient(ellipse at 70% 35%, rgba(71,99,82,0.11) 0%, rgba(71,99,82,0) 60%)",
        }}
      />

      {/* Honey — lower centre, very subtle warmth */}
      <div
        className="absolute blur-3xl"
        style={{
          bottom: "-20%",
          left: "20vw",
          width: "60vw",
          height: "80%",
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(184,134,45,0.09) 0%, rgba(184,134,45,0) 60%)",
        }}
      />
    </div>
  );
}
