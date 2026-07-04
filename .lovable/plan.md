## Goal

Create a welcoming, energetic landing page for SkyCo that communicates its mission, previews the available tools, and leaves visitors feeling supported and motivated.

## Design Direction: Sky & Light

- **Palette**: airy sky blues and soft whites (#e0f2fe, #7dd3fc, #38bdf8, #0c4a6e)
- **Tone**: bright, warm, encouraging — like someone quietly cheering you on
- **Typography**: clean, modern sans-serif with generous whitespace
- **Feel**: open, uplifting, uncluttered

## Plan

### 1. Design System Setup

- Update `src/styles.css` with SkyCo's light-theme tokens (sky blues as primary/accent, warm off-white background)
- Add a subtle animated sky/cloud or gradient hero background (CSS-only, lightweight)
- Register any needed custom utilities

### 2. Homepage Sections (single route: `/`)

Build the landing page in `src/routes/index.tsx` with these sections:

- **Navigation bar**: minimal, fixed top — SkyCo logo/name + links to sections (Tools, Motivation, Help) + CTA
- **Hero**: large friendly headline ("Welcome to SkyCo"), subheadline about practical support, soft sky gradient background, gentle scroll cue
- **Mission/About**: 2-3 short paragraphs explaining what SkyCo is and who it's for — warm, human copy pulled from the brand description
- **Tools showcase**: 4 tool cards in a clean grid — Grocery List, Budget Tracker, Calendar, Currency Converter. Each card gets an icon, short description, and a "Coming soon" or disabled "Open" state. Visually inviting even if not yet interactive.
- Moreover: Its broadly focused on Body, Mind, Success
- **Motivation band**: a full-width section with rotating/uplifting quotes — real, energising reminders. Warm sky-toned background.
- **Help/Requests**: a simple form area where visitors can ask a question or make a small request. Clean fields (name, message), encouraging microcopy.
- **Footer**: links, small brand sign-off, "As Above, So Below" tagline

### 3. Metadata & Branding

- Update `src/routes/__root.tsx` head meta: title "SkyCo — As Above, So Below", description, OG tags for social sharing
- Ensure responsive viewport and favicon links are correct

### 4. Responsive & Polish

- Mobile-first layout: stacked sections on small screens, grid cards on larger
- Smooth scroll between nav anchors
- Subtle hover states on cards and buttons
- No placeholder images — use Lucide icons and CSS shapes/gradients

## Out of Scope (for this plan)

- No backend/database yet — the help form will be client-only or a no-op submit
- Individual tool pages/interactive tools — they are previewed but not wired up
- Authentication

## Files to modify/create

- `src/styles.css` — theme tokens
- `src/routes/index.tsx` — full landing page
- `src/routes/__root.tsx` — head metadata
- `src/components/` — small reusable section components (Hero, ToolCard, QuoteBand, etc.)