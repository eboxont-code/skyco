> **Current project direction:** See [MASTER_PLAN.md](MASTER_PLAN.md) for the authoritative website-hardening → shared-services/API → Flutter Android programme and its acceptance checklist. This file is retained as the dated 31 October 2026 web-work backlog. Its completed entries are historical evidence; do not duplicate them or mark remaining shorthand IDs complete without the original brief and verification.

# SkyCo October 31 ordered updates

- [x] 0: October 30 changelog verified at phone/desktop; green checks and publication requested.
- [x] 9-finish: Mocked successful response announces confirmation and disables Joined at phone/desktop; no stored email created.
- [x] 10: Client-only honeypot tested; filled field makes no request, normal mocked join still confirms; publication requested.
- [x] 11: ProductFaqs already uses details with stable IDs through QuestionAnswers; /support#faq-currensee-1 opens at phone/desktop.
- [x] 12: HelpSection links to Support, FAQ and Status with purpose lines; phone/desktop checked, 44px targets; publication requested.
- [x] 14: Hero badge already has width, height, high fetch priority and async decoding; loaded at phone/desktop.
- [x] 15: Mission and all six home sections already have aria-labelledby pointing at their heading; verified phone/desktop.
- [x] 16: Seven support topics and optional topic prefill added; Float selection and email-opening flow verified phone/desktop; green checks.

- [x] 0: October 29 changelog added, phone/desktop checked; publication requested.
- [x] 5-desktop: Remove and confirmed/cancelled Clear all verified with an entered holding.
- [x] 6: Total value tested and checked at phone/desktop; publication requested.
- [x] 7: Copy list excludes ticked items; actual clipboard checked at phone/desktop; publication requested.
- [x] 8: Print list shows selected pack and its heading, hides menus; phone/desktop checked; publication requested.
- [x] 9: Inline validation previously tested; successful-join confirmation now verified with mocked success.

- [x] 0: October 28 changelog entry verified; publication requested.
- [x] U5-finish: Install and dismissal, iOS once, mobile/desktop and no layout shift verified; publication requested.
- [x] 1: Enter conversion verified with actual provider data at phone and desktop; publication requested.
- [x] 2: 7/30-day history selector, concrete date-limit tests and actual provider chart verified; publication requested.
- [x] 3: Chronos Copy link verified against actual clipboard on phone and desktop; publication requested.
- [x] 4: Invalid date keeps all last valid readings and recovers; mobile/desktop checked; publication requested.
- [x] 5: Clear all and Remove verified at 390px and desktop.

- [x] 0: October 27 changelog entry verified; publication requested
- [x] A13: Smaller badge variants verified at 390px and desktop; publication requested
- [x] A14: Four smaller screenshot variants verified on mobile and desktop; publication requested
- [x] A16-rest: Sentence note sizing implemented; Chronos, Float and rates checked at 390px; publication requested
- [x] A19: Completed in the previous release; do not repeat.
- [x] A21-rest: Four NRB pair configs, self metadata, 59 sitemap URLs; all four return 200 and unknown pair returns 404; publication requested. NRB unavailable state checked, no rates invented.
- [x] U2: Saved snapshots, max 20, restore and confirmed clear; actual Frankfurter result survives reload and refresh; 10 tests passed; publication requested.
- [x] U4: Picker flags and decorative popular/recent/favourite symbols verified at 390px and desktop; build green; publication requested.
- [ ] Numbered items: 17-31, 33-34, 36-41, 43-48, 54
- [x] FAV: SkyCo brand mark confirmed as favicon source; derived favicon.ico (48/32/16), 32px and 16px PNGs from existing mark (no new artwork); apple-touch-icon 180px and manifest 192/512 icons already present; root head links updated with sizes; all 8 icon/manifest URLs return HTTP 200; no Lovable/default icon references remain; no horizontal overflow at 390px or 1280px; build green; not published.
- [ ] CS1-CS10: Ordered CurrenSee copy and presentation fixes

Do not repeat completed items from the October 27 brief. Front end only, existing routes and packages only. Stop at a confirmed credit balance of 0.29 or less.
# SkyCo.Online bot backlog (added 5 November 2026)

Items tracked by the SkyCo.Online bot that were not yet in this file or MASTER_PLAN.md.

## Server / code route
- [ ] 6 November Phase 1 batch: reconcile seven-system Chronos copy, five-tool privacy/security, explicit Float sharing consent, Bun documentation, registry links and today's shipped-only changelog; verify 390px then desktop, lint and build. Do not publish. 9 November 2026 evidence: seven-system copy and first-party/planned registry entries already correct; reconciled five-tool disclosures, added explicit Float consent wording, Bun test command and shipped-only 9 November changelog. Privacy, Security, Float, Chronos and home verified at 390px then 1280px without page overflow; consent buttons >=44px, focus trap/Cancel/Escape make no share call, confirmed device share/clipboard and link readback pass. All 46 tests pass; scoped lint has no errors and preview build is green. Overall item remains open: full-project lint reports 1,490 existing errors and 10 warnings; unrelated mass formatting was not performed. Not published or deployed.
- [x] NRB fallback: retry the official latest published feed when the dated fetch fails; retain the last valid published payload on refresh outages and label its actual date. Five outage/validation tests and ten related tests pass; build green; 390px date label verified with a simulated response, no page overflow. Live NRB retrieval remains unverified because both official hostnames fail certificate verification here; a cold cache with both feeds unreachable still shows unavailable rather than invent rates. Not published.
- [x] Cache the last good rate per pair with its date and a stale flag. 10 November 2026 evidence: reused the existing bounded 60-second per-pair cache and NRB/Frankfurter loaders; expired-cache fetch failures retain the exact rate, source and provider date with stale=true, while cold-cache outages reject rather than invent or borrow another pair's rate. Added explicit “Stale rate. Last updated” labels to the converter and pair page, and propagated the NRB fallback stale flag into the page result. All 16 focused cache/NRB/Frankfurter tests pass, including new fresh and entirely cold-cache outage tests. Real Frankfurter AUD/USD data dated 2026-11-09 retained unchanged during simulated browser request failure at 390px first, then 1280px; date/stale label, uncached GBP/USD unavailable state, no horizontal overflow and 44px refresh/select controls verified. Scoped lint: zero errors, one existing hook warning with formatting rule excluded; preview build green. Cache remains bounded in-memory, not durable across server restarts. Not published or deployed.
- [x] Server-render each -to-npr pair page's rate in the raw HTML: already implemented in the shared pair loader using getNprRates and its retained last-good NRB payload. Verified all 19 configured pair pages return a rate, Nepal Rastra Bank source and matching time/dateTime in raw HTML on 7 November 2026. AUD page checked with JavaScript disabled at 390px then 1280px, no horizontal overflow; ten NRB/cache tests pass, including expired-cache outage retention and no invented cold-cache rate. No application code changes or publication.
- [x] Confirm which Frankfurter API version is used and add tests: v1 at https://api.frankfurter.dev/v1, latest USD-base lookup and open-ended dated history endpoint. Existing requests now reuse tested URL builders without changing endpoints. Four endpoint tests and ten cache/NRB tests pass; new files pass lint and preview build is green. Documented in README on 7 November 2026; not published.
- [x] Confirm the support/contact form sends and stores nothing server side, or document what it does: shared home/support form only opens mailto; no contact server call or database insert. README documents subject/body, optional name and user-agent, tab-local sessionStorage draft, local validation and the distinction from the stored Float waitlist. Synthetic submission checked at 390px then desktop: only mailto navigation, focused confirmation and cleared draft; no real email sent. Not published.

## Domain, DNS and search (needs access to the Hostinger account holding skyco.online)
- [ ] Free @skyco.online email or forwarding to main.skyco@gmail.com.
- [ ] Add Google Search Console TXT record (google-site-verification=wpfXT2n_BKnpaJJbRp58gbZb96Nv8rAdaDYKzTm-SIU), verify, submit sitemap.xml.
- [ ] Import the site into Bing Webmaster Tools.
- **SUPERSEDED — DO NOT EXECUTE (7 November 2026; historical proposal only):** 301 `currensee.skyco.online` to `skyco.online/currensee` and `chronos.skyco.online` to `skyco.online/chronos`, only after the subdomain gap audit shows every feature is on the main site. The current architecture keeps shipped products under `skyco.online/<product>`; this old redirect proposal is retained for history, not as an active DNS task. This documentation update made no DNS or hosting changes; the live redirect state remains unverified.
- [ ] Watch SSL expiry: apex, www, currensee 1 Dec 2026; chronos 15 Dec 2026.

## SkyCo's own free accounts
- [ ] GitHub, Vercel, Supabase and Sentry accounts on main.skyco@gmail.com (free plans). GitHub sign-up is blocked at a verification step.
- [ ] Migrate on a preview first; keep the current setup live until checked; delete nothing.

## Growth
- [ ] Traffic is about 3% of the ~2,000 visitors per fortnight AdSense bar; Search Console sitemap submission is the main lever.
