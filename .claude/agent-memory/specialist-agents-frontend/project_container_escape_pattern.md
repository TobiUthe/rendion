---
name: Container escape pattern for full-bleed backgrounds
description: Hero background inside container-xl clips to padded box; use left:50%/width:100vw/translateX(-50%) to escape
type: project
---

The `HeroWithCalculator` hero section sits inside `container-xl page-px` in `page.tsx`. Any
`absolute inset-0` child is clipped to that padded container box (max-width 80rem + horizontal
padding). Ambient background blobs positioned with percentage offsets hit the container edge
instead of going off-screen, producing a hard vertical seam at the padding boundary.

**Fix:** Use the viewport-escape pattern on the background container:

```css
position: absolute; /* comes from inset-0 on the outer div */
left: 50%;
width: 100vw;
transform: translateX(-50%);
```

This anchors horizontal position and width to the viewport, not the container, so blobs
positioned beyond the viewport width are truly off-screen. `top: 0 / bottom: 0` still
come from `inset-0`, so height remains relative to the section.

**Why:** The parent layout uses `PublicLayout width="full"` with a separate `container-xl page-px`
wrapper only around the hero, not full-bleed. Sections like `FeatureBentoGrid` and `TrustBadges`
manage their own widths. Background effects inside the hero container need this escape.

**How to apply:** Whenever adding a decorative full-bleed background inside a container-constrained
section in this codebase, use this pattern instead of `absolute inset-0` alone.
