# Frontend Agent Guide

Read this before any `.tsx` or Storybook work. Skim the linked specs for the domain you're touching.

---

## Before you write UI code

1. **Check the specs.** [`docs/specs/README.md`](./specs/README.md) is the index. If your change touches mobile layout, charts, or the parameter panel, the relevant spec tells you what patterns already exist so you don't reinvent them.
2. **Check Storybook first.** Open `src/stories/` and look for an existing primitive that matches. Typography lives in `src/lib/design-tokens.ts` — use `cn(TOKEN, extras)` rather than inline font/text classes ([typography spec](../src/lib/specs.md)).
3. **Check the predecessor.** `C:/Users/TobiasUthe/Documents/Github/immo-deals/src/` (incl. `_parked/`) is the previous rewrite. Port patterns intentionally; don't copy wholesale.

---

## Storybook conventions

- Stories live in `src/stories/` mirroring the component tree:
  - `src/stories/primitives/` → `src/components/ui/`
  - `src/stories/comprehensive-components/` → feature-level components
  - `src/stories/pages/` → full-page compositions
- File name: `<ComponentName>.stories.tsx`.
- Import from `@storybook/nextjs-vite`, **not** `@storybook/react` (the lint rule `storybook/no-renderer-packages` enforces this).
- Title follows the folder: `'Comprehensive Components/ParameterPanel'`, `'Primitives/Button'`, etc.
- Default `layout: 'centered'` unless the component needs full width (e.g. `BottomSheet` uses `layout: 'fullscreen'`).
- For responsive components, add a mobile viewport variant:
  ```ts
  parameters: { viewport: { defaultViewport: 'mobile' } }
  ```
  The viewports (`mobile` 390×844, `tablet` 768×1024, `desktop` 1280×800, `wide` 1536×900) are configured in `.storybook/preview.ts`.
- Story sort order is fixed in preview.ts — no need to set `tags` or `sort` on individual stories.

Minimal template:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MyComponent } from '@/components/...';

const meta = {
  title: 'Comprehensive Components/MyComponent',
  component: MyComponent,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { /* ... */ } };
export const Mobile: Story = {
  args: { /* ... */ },
  parameters: { viewport: { defaultViewport: 'mobile' } },
};
```

---

## Styling conventions

- Typography: **always** go through `@/lib/design-tokens` (`HEADINGS`, `BODY`, `DATA`). Never inline `font-display`, `text-sm`, `text-stone-*` directly in JSX for type styles.
- Color: `primary-*`, `sand-*`, `stone-*`, `success/warning/danger-*` — no `neutral-*` in component JSX.
- Spacing: `gap-*`, `p-*`, `mt-*` are fine; use the progressive pattern `p-3 sm:p-5 md:p-6` for surfaces that reach mobile.
- Responsive: see [`docs/specs/mobile-responsive.md`](./specs/mobile-responsive.md).

---

## Verification

After UI changes:

1. `npx tsc --noEmit` — must pass.
2. `npx eslint <changed files>` — must pass for the files you touched. Pre-existing errors in unrelated files are OK to leave alone.
3. `npx next build` — must generate all routes.
4. Open the affected page(s) in a real browser at 375 / 768 / 1024 / 1280 widths. Type checking does not catch layout bugs.
