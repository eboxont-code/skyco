## Brand + density refresh

**Logos & assets**
- Upload the four provided images via `lovable-assets` CLI:
  - `1_to_2_ratio.png` → horizontal lockup (navbar, footer)
  - `xSkyCo.png` (circular badge) → hero mark
  - `cropped-skyco-compress.png` → favicon + og image
  - `SkyCo_2.png` → reserved alt badge
- Replace text-only "SkyCo" wordmark in `Navbar` and `Footer` with the horizontal logo image.
- Add the circular badge as a floating hero element next to the headline.
- Update `public/favicon.png` (via asset) and wire in `src/routes/__root.tsx` head links + `og:image`.

**Color scheme (match logo cyan/blue)**
Rework tokens in `src/styles.css`:
- `--sky-bright`: vivid cyan `#22c9e6` (logo background)
- `--sky-deep`: deep royal blue `#0b3b8c` (logo wing shadows)
- `--sky-mid`: bright azure `#2b8bff`
- `--sky-ice`: pale cyan `#c8f1fa`
- Primary → deep blue; accents → cyan; hero gradient goes cyan → azure → deep blue (bolder, less pastel).
- Buttons: solid deep-blue with cyan glow hover; outline variants use cyan border.

**Tighten spacing (fix empty feel)**
- Reduce section vertical padding from `py-24/py-32` → `py-12 md:py-16`.
- Hero: shrink min-height from `100vh` → `auto` with `py-16 md:py-24`; two-column layout (copy left, circular logo right) so it's not a sparse centered block.
- Mission: 4 compact pillar cards in one row on desktop (was large 3-up), smaller padding, tighter gap.
- Tools grid: reduce card padding, tighter gap-4, add subtle logo-cyan accent stripe.
- Motivation band: shorter (`py-10`), single-line rotating quote.
- Help section: two-column (intro left, form right) instead of stacked full-width.
- Footer: compact single row with mini logo + links.
- Global container max-width tightened to `max-w-6xl`; consistent `gap-6` rhythm.

**Files touched**
- new: `src/assets/skyco-logo.png.asset.json`, `src/assets/skyco-badge.png.asset.json`, `src/assets/skyco-icon.png.asset.json`
- edited: `src/styles.css`, `src/routes/__root.tsx`, `src/components/Navbar.tsx`, `src/components/Hero.tsx`, `src/components/Mission.tsx`, `src/components/ToolsGrid.tsx`, `src/components/MotivationBand.tsx`, `src/components/HelpSection.tsx`, `src/components/Footer.tsx`
- delete: default `public/favicon.ico`

**Out of scope:** tool functionality, backend, new sections.
