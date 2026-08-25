---
name: dba-design
description: Use this skill to generate well-branded interfaces and assets for the DBA (Digital Business Akademie) Digital Sales Management course — Lernportal lesson pages, process/flow diagrams, cards, task sheets and supporting infographics, for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, and UI kit components.
user-invocable: true
---

Read `readme.md` in this skill first — it holds the full design guide (content fundamentals, visual foundations, iconography, manifest). Then explore:

- `styles.css` + `tokens/` — link `styles.css` to inherit all CSS custom properties (colors, type scale, spacing, radii, shadows). Never hard-code hexes that already exist as tokens.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/` — reusable React primitives (core, process, content, navigation). Read each `<Name>.prompt.md` for usage.
- `ui_kits/lernportal/` — a full lesson-page recreation to fork.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and produce static HTML files that link `styles.css`. If working on production code, read the rules here and reuse the components.

Signature move: DBA leans hard on **process visualization** — use `ProcessFlow` (snake with arrows), `Cycle` (dashed ring), `Funnel` (narrowing stages) and `PhaseLane` (role swimlanes) rather than plain card grids whenever content is a sequence, loop or funnel.

Guardrails: German, informal "du". Two fonts only — Archivo (display) + Public Sans (body). Teal primary, coral accent (used sparingly). No emoji, no icon font — Unicode glyphs only (⌕ ✓ ▾ → ↓ ↻ ▶ ↗). No logo file exists; render the typographic **DBA** tile.

If invoked without guidance, ask what to build, ask a few questions, and act as an expert DBA designer producing HTML artifacts or production code.
