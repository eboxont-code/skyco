## Goal

Link the "Currency Converter" tool card to the live CurrenSee site, rewrite copy in a warmer first-person human voice (no em dashes, no AI-flavored phrasing), and clean up production-readiness issues.

## Changes

### 1. Link Currency Converter to CurrenSee

- `src/components/ToolsGrid.tsx`: add optional `href` + `status` handling. For the Currency Converter card, set `href: "https://skycocurrensee.lovable.app"` and status `"Live"` (with an external-link icon). Card becomes a real `<a target="_blank" rel="noopener noreferrer">`. Other three cards keep the "Coming soon" pill and stay non-clickable.

### 2. Rewrite copy — human, first-person, no em dashes

Replace every `—` with a period, comma, or parentheses depending on rhythm. Swap AI-flavored lines ("quiet place built to help you…", "small lifts that add up", "we read every message", "as above, so below" chrome text stays as tagline only) for a personal "I / we" voice from the maker.

Files touched:

- `src/components/Hero.tsx` — new headline copy + description in first person (e.g. "Hi, I'm building SkyCo. It's a small collection of tools I actually use to keep my week calm.").
- `src/components/Mission.tsx` — section heading + three pillar descriptions rewritten as personal notes.
- `src/components/ToolsGrid.tsx` — tool descriptions rewritten short and plain; intro paragraph rewritten.
- `src/components/HelpSection.tsx` — heading, intro, bullet list, form labels/placeholders, success message.
- `src/components/MotivationBand.tsx` — heading + fallback caption text.
- `src/components/Footer.tsx` — tagline + copyright line (remove `·` em-dash-adjacent styling, use plain punctuation).
- `src/routes/__root.tsx` — `<title>`, meta description, og/twitter title + description rewritten in same voice, em dashes removed.

### 3. Production polish (scan pass)

- Remove leftover `—` characters anywhere in `src/` (grep pass across components + root meta).
- `HelpSection`: form currently only sets local `submitted` state and never sends the message. Add a minimal `mailto:` submission (open user's mail client to `hello@skyco.online` or similar) so the contact form actually does something in production. Confirm the destination email with the user before wiring, or fall back to just keeping the visual confirmation and add a note.
- Trigger the SEO scanner after edits to catch anything the copy rewrite affected (title/description length, H1 uniqueness).

## One thing I need from you

For the contact form, what should happen when someone hits **Send Message**?

1. Open their mail app with a prefilled email to an address you own : send to support@skyco.online

Reply with 1 / 2 / 3 (and the email if option 1) and I'll implement.