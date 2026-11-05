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
- [ ] FAV: Existing SkyCo brand favicon and touch icon
- [ ] CS1-CS10: Ordered CurrenSee copy and presentation fixes

Do not repeat completed items from the October 27 brief. Front end only, existing routes and packages only. Stop at a confirmed credit balance of 0.29 or less.
# SkyCo.Online bot backlog (added 5 November 2026)

Items tracked by the SkyCo.Online bot that were not yet in this file or MASTER_PLAN.md.

## Server / code route
- [x] NRB fallback: retry the official latest published feed when the dated fetch fails; retain the last valid published payload on refresh outages and label its actual date. Five outage/validation tests and ten related tests pass; build green; 390px date label verified with a simulated response, no page overflow. Live NRB retrieval remains unverified because both official hostnames fail certificate verification here; a cold cache with both feeds unreachable still shows unavailable rather than invent rates. Not published.
- [ ] Cache the last good rate per pair with its date and a stale flag.
- [ ] Server-render each -to-npr pair page's rate in the raw HTML (currently client only).
- [ ] Confirm which Frankfurter API version is used and add tests.
- [ ] Confirm the support/contact form sends and stores nothing server side, or document what it does.

## Domain, DNS and search (needs access to the Hostinger account holding skyco.online)
- [ ] Free @skyco.online email or forwarding to main.skyco@gmail.com.
- [ ] Add Google Search Console TXT record (google-site-verification=wpfXT2n_BKnpaJJbRp58gbZb96Nv8rAdaDYKzTm-SIU), verify, submit sitemap.xml.
- [ ] Import the site into Bing Webmaster Tools.
- [ ] 301 currensee.skyco.online to skyco.online/currensee and chronos.skyco.online to skyco.online/chronos, only after the subdomain gap audit shows every feature is on the main site.
- [ ] Watch SSL expiry: apex, www, currensee 1 Dec 2026; chronos 15 Dec 2026.

## SkyCo's own free accounts
- [ ] GitHub, Vercel, Supabase and Sentry accounts on main.skyco@gmail.com (free plans). GitHub sign-up is blocked at a verification step.
- [ ] Migrate on a preview first; keep the current setup live until checked; delete nothing.

## Growth
- [ ] Traffic is about 3% of the ~2,000 visitors per fortnight AdSense bar; Search Console sitemap submission is the main lever.
