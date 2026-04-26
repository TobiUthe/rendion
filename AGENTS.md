<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Specs — read them, keep them current

Durable patterns and conventions live in [`docs/specs/`](docs/specs/README.md). The index lists every spec and its domain.

**Before you change code:** skim the spec(s) covering the domain you're touching. If a spec exists, follow its patterns rather than inventing a new one.

**After you change code:** if the change alters a pattern a spec describes, update the spec in the same change. If the change introduces a new reusable pattern worth repeating, extend an existing spec or write a new one and link it from [`docs/specs/README.md`](docs/specs/README.md). This keeps the specs a reliable reference rather than a snapshot that rots.

Specs describe **durable patterns** — architecture, APIs, conventions. Not tasks, not incidents, not work-in-progress. Those belong in a plan file or a commit message.

# Storybook & Frontend

Before adding or editing any `*.tsx` UI code or `*.stories.tsx`, read [docs/FRONTEND_AGENT_GUIDE.md](docs/FRONTEND_AGENT_GUIDE.md).

# Predecessor project

Rendion is a rewrite of an earlier project that grew too complex. When looking for prior art — patterns, solved problems, or components worth reviving — consult:

- `C:/Users/TobiasUthe/Documents/Github/immo-deals/src/` — the shipping implementation of the previous version.
- `C:/Users/TobiasUthe/Documents/Github/immo-deals/src/_parked/` — components and modules that were set aside but may be reusable here.

Treat it as a reference, not a template. Rendion intentionally diverges in scope and architecture.
