> [!WARNING]
> **Historical snapshot — not the current architecture or source of truth.**
> This plan describes an earlier three-project/subdomain arrangement. The current repository registry (`src/lib/projects.ts`) ships five first-party products on `https://skyco.online/<product>`; Budget & Expenses and Daily Notes remain planned. Do not implement the old subdomain destinations or treat the old project list as current.
>
> Current execution authority: [MASTER_PLAN.md](../MASTER_PLAN.md), [AGENTS.md](../AGENTS.md), and the actual current source files. This historical note is preserved for context only.

## What I verified

- Live projects in your workspace: **CurrenSee**, **Celestial Timekeeper (Chronos)**, **My Finance Friend**.
- Domain checks (HTTP 200): `skyco.online`, `currensee.skyco.online`, `chronos.skyco.online`.
- **My Finance Friend has no skyco.online subdomain yet** — I probed finance/mff/portfolio/money/financefriend/etc., all fail to resolve. Only `chat-folio-pilot.lovable.app` responds. I'll use the lovable URL for now and swap it the moment you connect a subdomain (see note at the end).
- SkyCo's Tools grid still lists Calendar and Budget as "Coming soon" even though Chronos and Finance Friend are live — that's the core data gap.

## Changes

### 1. Tools section: Live now + On the way

`src/components/ToolsGrid.tsx` becomes two rows:

**Live now** (real cards, real links, real feature copy pulled from each project):
- **CurrenSee** — live fiat + crypto conversion, rate charts, price alerts. → `https://currensee.skyco.online/`
- **Chronos (Celestial Timekeeper)** — Gregorian, Hijri, Hebrew, Chinese and Persian calendars side by side, plus scheduling. → `https://chronos.skyco.online/`
- **My Finance Friend** — track stocks and ETFs by chatting in plain English, with a preview before anything saves. → `https://chat-folio-pilot.lovable.app/`

**On the way** (muted, smaller cards, no links): Grocery List, Budget & Expenses (folded into the Finance Friend story or kept as a separate idea), and Notes/Calendar extras.

### 2. Navbar + Footer

- `src/components/Navbar.tsx`: fix the CurrenSee href to include the trailing slash, point Celestial Timekeeper at `https://chronos.skyco.online`, keep My Finance Friend on its lovable URL, and sharpen taglines to match the real features.
- `src/components/Footer.tsx`: add a "Projects" column linking the same three live apps so every page footer cross-links the family.

### 3. Copy that matches reality

`src/components/Hero.tsx` and `src/components/Mission.tsx`: change "nothing live yet" framing to "three tools live, more on the way", keeping your first-person voice. No em dashes.

### 4. SEO / structured data full pass

- `src/routes/__root.tsx`: switch every URL from `skycoonline.lovable.app` to `https://skyco.online` (JSON-LD WebSite + Organization, logo). Add `og:url` and `og:site_name`.
- Extend the Organization JSON-LD with `subOrganization` / an `ItemList` of the three live projects so search engines understand SkyCo as the parent brand.
- `src/routes/index.tsx`: add a leaf `head()` with its own title, description, og:*, `og:url` and a self-referencing `<link rel="canonical">` on `https://skyco.online/`.
- `src/routes/sitemap[.]xml.ts`: set `BASE_URL` to `https://skyco.online`.
- `public/robots.txt`: point the Sitemap directive at `https://skyco.online/sitemap.xml`.
- `public/llms.txt`: rewrite to describe SkyCo as the hub and list the three live project URLs.

### 5. Accessibility + integrity check

- Re-check the projects dropdown for keyboard access (Escape to close, focus handling) since it's currently hover/click only.
- Confirm all external links carry `target="_blank" rel="noopener noreferrer"` and that external-link icons have accessible labels.
- Run a security scan and re-check SEO findings, marking the ones these edits resolve.

## Note on Finance Friend

If you want it on `finance.skyco.online` (or another subdomain), connect it in that project's Settings → Domains. Tell me once it resolves and I'll swap the link everywhere in one pass. I can't add domains to another project from here.

## Files touched

`src/components/ToolsGrid.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/Hero.tsx`, `src/components/Mission.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/sitemap[.]xml.ts`, `public/robots.txt`, `public/llms.txt`
