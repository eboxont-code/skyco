## Goal

Ship SkyCo. Point Currency Converter at its real custom domain, tighten the footer, and clear every actionable SEO/accessibility finding so the live site is production-ready.

## Changes

### 1. Currency Converter → live custom domain

`src/components/ToolsGrid.tsx`: change the Currency Converter `href` from `https://skycocurrensee.lovable.app` to `https://currensee.skyco.online/`. Keep the card as a real `<a target="_blank" rel="noopener noreferrer">` with the "Live" pill.

### 2. Footer polish

`src/components/Footer.tsx`: rewrite the copyright line to
`© 2026 SkyCo. Made with ♥` (heart icon only, no trailing "for real people" text). Keep the year dynamic via `new Date().getFullYear()` so it stays correct.

### 3. SEO findings (clear all failing)

- **Homepage heading & links (`agent_content:content`)** — `Hero.tsx`: change H1 from "Welcome to SkyCo" to `SkyCo. Small, honest tools for everyday life.` (descriptor + brand). Change the "Learn More" button text to `Read about the mission`. `Navbar.tsx` + `Footer.tsx`: update logo `alt` from `"SkyCo"` to `"SkyCo brand mark"`.
- **Structured data (`agent_metadata:structured_data`)** — `src/routes/__root.tsx`: add `scripts` with two JSON-LD blocks (WebSite + Organization) using name `SkyCo`, url `https://skycoonline.lovable.app`, and logo pointing at the badge asset URL.
- **robots.txt (`http:robots`)** — create `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://skycoonline.lovable.app/sitemap.xml
  ```
- **sitemap.xml (`http:sitemap`)** — create `src/routes/sitemap[.]xml.ts` as a server route returning XML with a single `/` entry (only public route in the app), `BASE_URL = "https://skycoonline.lovable.app"`.
- **llms.txt (`http:llms_txt`)** — create `public/llms.txt` with `# SkyCo`, one-line summary, and a Pages section linking `/` only (no other public routes, no auth/admin surfaces).
- **Lighthouse performance (`lighthouse:lighthouse_performance`)** — `Hero.tsx`: add `width`/`height` and `fetchpriority="high"` on the badge hero image, remove any lazy loading. `__root.tsx`: add a `<link rel="preload" as="image">` for the badge asset URL in the root `head().links`.
- **Lighthouse accessibility (`lighthouse:lighthouse_accessibility`)** — `src/routes/index.tsx`: wrap the section content (Hero through HelpSection) in a single `<main>` between Navbar and Footer. No color changes needed (existing tokens already meet contrast).
- **Google Search Console (`gsc:gsc`)** — call `standard_connectors--connect` with `google_search_console` so the user can authorize, then run the META verification + `PUT sites/...` flow against `https://skycoonline.lovable.app/`. Requires user to complete the OAuth prompt.

After edits, call `seo_chat--update_findings` to mark each fixed finding.

### 4. Security & integrity pass

- `security--run_security_scan` for a fresh scan (last supabase/supply-chain scan is >12h stale). Current results show 0 findings across all scanners; re-run to confirm before publishing.
- Quiet fix the runtime error `error loading dynamically imported module … createIsomorphicFn.js` (dev-only stale module cache from the Firecrawl work) by restarting the dev server after edits land.
- Verify Firecrawl connector is still linked and `LOVABLE_API_KEY` is present (Instagram tiles gracefully fall back to emojis on 403, which is already handled).

### 5. Skip / not doing

- No copy rewrites beyond the H1 / Learn More / Footer lines above — the rest is already in the user's voice.
- No custom domain wiring on the SkyCo project itself (user hasn't asked; live URL is `skyco.online`).
- Not publishing from the tool — user publishes from the Publish button when ready.

## Files touched

- `src/components/ToolsGrid.tsx` (href)
- `src/components/Footer.tsx` (copyright + alt)
- `src/components/Hero.tsx` (H1, button text, image attrs)
- `src/components/Navbar.tsx` (alt)
- `src/routes/__root.tsx` (JSON-LD, preload)
- `src/routes/index.tsx` (single `<main>`)
- `public/robots.txt` (new)
- `public/llms.txt` (new)
- `src/routes/sitemap[.]xml.ts` (new)