# DBA Design System

The visual language of the **Digital Business Akademie (DBA)** *Digital Sales Management* course — extracted from the **Lernportal** (learning-portal) web app built for **Batch 8**. It turns a large body of slide-deck course material into a calm, editorial, self-study reading experience.

> **Scope note:** this system is a *visual style reference*. Sample copy mentions products, brands and personas (BMW, HubSpot, "München Max", Novasoft/Clarity Flow, etc.) that are teaching examples from the course — they are not facts about the user or about DBA.

## What this is for

Building on-brand DBA learning material: lesson pages, process/flow diagrams, cards, task sheets, and supporting infographics. Everything here is derived from a single working artifact — `Lernportal.dc.html` at the project root — which is the ground-truth reference implementation.

## Sources

- **`Lernportal.dc.html`** (project root) — the reference application. All tokens and components below are lifted from its inline styles.
- **`DBA Batch 8/`** (local folder, attached) — the raw course material: per-lesson `.pptx.pdf` decks, task-sheet `.docx`/`.pdf`, infographics (`.png`/`.jpg`), and videos, organized by lesson code (`1.1.1` … `2.1.6`). This is the *content* the portal presents; it carries no separate brand kit.
- Author of the course material: **Marc Pönisch** (per file names). Slide master footer reads "DBA Digital Business Akademie".

## No logo asset

The sources contain **no standalone logo file**. The portal renders the brand as a typographic mark: the letters **DBA** in Archivo 900 on a teal gradient tile (`linear-gradient(140deg, #22707B, #123E45)`), with "Digital Sales Academy" / "Batch 8 · Lernportal" set beside it. Reuse that typographic treatment wherever a mark is needed. **Do not draw or invent a DBA logo.**

---

## CONTENT FUNDAMENTALS

**Language.** German (de-DE), including ß and umlauts. Anglicisms from sales/tech are kept verbatim and untranslated: *Sales Development, Inbound/Outbound, Lead, Pitch, Closing, Growth Mindset, Rapport, Sales Enablement, Buying Center, CRM, SaaS*.

**Address.** Informal second person **"du"** throughout ("Warum dieser Beruf gerade jetzt so gefragt ist", "Baue mit deinem Team …", "Dein Fortschritt"). Never "Sie". Warm, coaching, encouraging — an academy talking to its trainees, not a corporation.

**Casing.** Sentence-style German capitalization in prose. Eyebrows and small labels are UPPERCASE with wide tracking ("ABSCHNITT 01", "AUFGABE · TASK SHEET 1.3.1"). Lesson codes are dotted numerals ("1.3.2", never "Lektion 2" alone — both are shown: "Kapitel 1.3.2 · Lektion 2").

**Structure of a lesson.** Eyebrow → title → one-sentence lead → sections. Each section: "Abschnitt NN" eyebrow, a title, an optional lead, then content blocks. Lessons close with a **"Recap & Aufgabe"** section: a 2×2 grid of numbered takeaways plus a **Task Sheet** card of "Lernziele"/"Euer Auftrag" goals.

**Copy rhythm.** Titles are short and declarative ("Der B2B Einkaufsprozess", "Feedback richtig geben"). Card bodies are one or two tight sentences. Leads are a single sentence that frames the section. Notes/asides start with the point, not throat-clearing.

**Tone examples.**
- Lead: "Ein einfacher Kreislauf verwandelt Rückmeldungen in konkrete Verbesserung."
- Note: "Der Prozess läuft nicht immer linear ab und variiert von Unternehmen zu Unternehmen …"
- Quote/example (in a quote block): „Jeden Monat übergibt das Marketing X qualifizierte Leads an den Vertrieb …"

**Emoji.** Not used in the portal UI. (The raw slide decks occasionally use them; the portal deliberately does not.) Do not add emoji.

**Numbers as glyphs.** Steps are two-digit zero-padded ("01"…"08"). Funnel/model stages can use single letters ("A I D A"). Percentages for progress ("64 %", space before %).

---

## VISUAL FOUNDATIONS

**Overall vibe.** Editorial, calm, grown-up. A dark chrome frame (sidebar + translucent header) wraps a warm off-white "paper" reading column. It reads like a well-set textbook, not a dashboard. Generous whitespace, a single narrow content column (max 900px), strong type hierarchy, restrained color.

**Two worlds of neutral.**
- *Dark shell* — sidebar and header chrome on `#14161C`; text in cool greys (`#AEB3BE`, `#8A8F9C`, `#666B79`); mint (`#7FC7B9`) for lesson codes; hairlines are `rgba(255,255,255,.05–.08)`.
- *Light paper* — content on `#F5F4F0`; cards pure white; warm hairline borders `#E4E1D9`; ink `#14171E`, body `#565C69`, muted `#9AA0AC`.

**Color usage.** Teal (`#22707B` / deep `#123E45`) is the primary — deep teal fills primary buttons and step-number tiles. Coral (`#E4694B`) is the single accent: eyebrows, active-lesson stripe, progress fill, text selection. It is used sparingly and never as a large fill. Process diagrams use five muted **tone families** (teal, slate, plum, sky, rose) to distinguish lanes/roles — each is a {solid, tint bg, hairline} triple. Card variants: white (default), teal-tint (`#F0F6F4`), accent-tint (`#FBF2EE`), and deep-teal (`#123E45`, white text) for emphasis.

**Type.** Two families only. **Archivo** for everything structural — hero (900/42px, -.025em), section titles (800/31px), block headings (700/20px), card titles (700/17px), eyebrows (800/12px/.14em uppercase), numbers and badges. **Public Sans** for reading text — leads (400/18px/1.6), body (400/16px/1.6), card copy (400/14.5px/1.6). Headings carry slight negative tracking; body is airy at 1.6 line-height. No third font, ever.

**Backgrounds.** Flat color only. One gradient exists (the teal logo tile). No photographic hero backgrounds, no textures, no patterns, no full-bleed imagery in the reading column. Infographics/photos appear inside cards or an overlay, never behind text.

**Cards.** Rounded `16px`, 1px warm border, white (or a tint), padding ~22×24px, **no drop shadow** by default. Process-step cards add a 3px top accent stripe in the lane's tone color. Cycle nodes are the one shadowed element (`0 6px 18px rgba(20,23,30,.06)`) because they float over a dashed ring.

**Corner radii.** 8px buttons & sidebar rows & step-number tiles · 11px inputs, logo tile · 13px cycle nodes · 16px cards/lanes/callouts · 99px chips, badges, progress bar.

**Borders & dividers.** Warm 1px `#E4E1D9` on light; translucent white on dark. Breadcrumb separators use a softer `#C9C6BE`. Accent stripes: 3px top (flow cards), 4px left (funnel rows), inset 2px left (active sidebar row, coral).

**Process diagrams (the signature motif).** The system leans hard on visualizing processes:
- **Flow** — snake-layout grid of numbered step cards; → between steps in a row, ↓ at row breaks, and even rows flow right-to-left with ← so the path is continuous.
- **Cycle** — nodes evenly placed on a dashed ring with ▶ chevrons between them and a ↻ + label in the middle.
- **Funnel** — stacked rows narrowing top-to-bottom, ↓ between, letter/number tile on the left.
- **Phase lanes** — grouped "swimlanes" (e.g. SDR / AE / CSM), each a headed card with its steps in a row and ↓ between lanes.
Arrows are text glyphs (→ ← ↓ ↻ ▶) set in Archivo 800, tinted the lane color — never hand-drawn SVG.

**Buttons.** Primary = deep-teal fill `#123E45`, white Archivo 700 text, 11px radius, ~11×18px padding. A secondary "resource" button uses a slate fill (`#33415C`) with a mint icon tile. Hover lifts (`translateY(-2px)`) with a soft shadow and a slightly darker fill. No outline/ghost button in the source.

**Chips / pills.** 99px radius, white bg, 1px `#E4E1D9` border, Public Sans 600, ~7×14px — used for hero metadata and in-page section jump links.

**Inputs.** 40px tall, 11px radius, 1px `#E4E1D9` border, white, with a leading ⌕ glyph for search.

**Motion.** Minimal and functional. `width .35s ease` on the progress bar; `transform .15s ease` + shadow on button hover. No entrance animations, no bounces, no parallax.

**Hover / press.** Hover = darker fill and/or a lift + soft shadow; sidebar rows get a faint white wash (`rgba(255,255,255,.08)`). Active nav row: white text + coral inset stripe. Press states are not elaborate — rely on the fill change.

**Transparency & blur.** Used once, deliberately: the header is `rgba(245,244,240,.9)` with `backdrop-filter: blur(10px)` so paper scrolls under it. The lesson-overlay scrim is `rgba(15,17,22,.72)` + `blur(4px)`.

**Iconography.** Almost none. The UI uses a few Unicode glyphs as icons — ⌕ (search), ✓ (complete), ▾/▸ (disclosure carets), and the process arrows → ← ↓ ↻ ▶. No icon font, no SVG icon set, no emoji. See ICONOGRAPHY below.

---

## ICONOGRAPHY

The portal has **no icon library**. Its entire icon vocabulary is Unicode glyphs rendered in the type families already loaded:

- **⌕** search (header input)
- **✓** lesson completed (coral tile / checkbox)
- **▾ / ▸** expand / collapse (sidebar groups)
- **→ ← ↓** process direction (flows, funnels, phase lanes)
- **↻** cycle center
- **▶** cycle progression chevrons
- **↗** external-resource button

Guidance: prefer these glyphs. If a richer icon is genuinely required, substitute the closest match from a light-stroke CDN set (e.g. **Lucide**, 1.5px stroke) and flag the substitution — do not introduce a heavy or filled icon style, and never use emoji.

---

## INDEX / MANIFEST

Root:
- `styles.css` — global entry (import this). `@import`s the four token files.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`.
- `readme.md` — this file.
- `SKILL.md` — portable skill wrapper.
- `Lernportal.dc.html` — reference implementation (ground truth).

Design System tab (specimen cards):
- **Type**, **Colors**, **Spacing**, **Brand** groups under `guidelines/`.

Components (`components/`):
- `core/` — Button, Chip, Card
- `process/` — ProcessFlow, Cycle, Funnel, PhaseLane
- `content/` — Callout, QuoteBlock, TaskCard, DataTable
- `navigation/` — SidebarNav

UI kit (`ui_kits/lernportal/`):
- Full lesson-page recreation (sidebar + header + reading column + process diagrams).

## Caveats

- **Fonts are Google-hosted** (Archivo, Public Sans) via `tokens/fonts.css`. No `.woff2` binaries are bundled — drop them into `assets/fonts/` and swap the `@import` for `@font-face` rules if you need offline/self-hosted.
- No logo file exists; the typographic **DBA** tile stands in.
