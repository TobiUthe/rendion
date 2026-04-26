# Storybook Coverage

Every component and page has a corresponding Storybook story. Stories live in `src/stories/` mirroring the component structure.

Source: [`src/stories/`](../../src/stories/).

---

## Rule

**All UI components and pages must have at least one story.** Stories serve as:
- Visual regression baseline (Chromatic integration)
- Design documentation
- QA checklist (test every variant, every breakpoint)
- Developer onboarding (how to use this component?)

Stories are not optional — they are a quality gate.

---

## Story structure

Stories live under one of these folders:

| Folder | Purpose |
|--------|---------|
| `comprehensive-components/` | Reusable components (buttons, forms, panels, charts, shells) |
| `primitives/` | Tiny building blocks (tokens, icons, single-use atoms) |
| `pages/` | Full page templates and layouts |

Story file name matches the component file name: `Button.tsx` → `Button.stories.tsx`.

---

## Checklist for a new component

When adding a component, also add a story with:

- **Default variant** — the happy path
- **Empty/error/loading states** — edge cases
- **Responsive variants** — mobile, tablet, desktop
- **Prop variations** — if the component has boolean flags or enum options, story them
- **Dark mode** (if applicable)

Example: a form input story shows default, disabled, error states, and both narrow and wide viewports.

---

## Running Storybook

```bash
npm run storybook
```

Opens `http://localhost:6006` with live reload on story changes.

---

## Maintenance

- Update stories when you change a component's API (prop names, defaults, shapes).
- Delete stories for deleted components.
- If you find a bug via Storybook, fix it and note the story in the commit message.
