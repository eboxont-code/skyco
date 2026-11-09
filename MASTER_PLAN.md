# SkyCo Master Plan
## Website hardening → shared product services → Android application

**Plan version:** 1.0  
**Last aligned with repository:** 9 November 2026  
**Repository:** `eboxont-code/skyco`  
**Default branch at alignment:** `main`  
**Current delivery target:** upgraded `https://skyco.online` plus one Android application  
**Development workstation:** Windows  
**Current mobile platform scope:** Android only  
**iOS/macOS:** deliberately out of scope for this delivery; keep the architecture portable without requiring a Mac.

---

## 0. Executive direction

Build on the working SkyCo product that already exists. Do not replace the website, rewrite its technology stack, create five duplicate apps, or port unverified behaviour into Flutter.

The delivery sequence is:

1. **Audit and protect the existing website and repository.**
2. **Finish the website's correctness, privacy, security, accessibility and mobile experience.**
3. **Extract and document stable services/contracts only where a mobile client needs them.**
4. **Build one modular Flutter Android app on Windows.**
5. **Port the five already-shipped tools one at a time, using the website as the behaviour reference and shared test fixtures as the parity contract.**
6. **Test, release and maintain the website and app as one product family.**

The website remains independently useful. The Android app is a first-class client, not a WebView wrapper. The two clients share verified service contracts and product rules; they do not need to share the same UI framework or duplicate private data.

### Product principle

**Small useful tools, clear limitations, no compulsory account, no unnecessary data collection.**

Do not introduce monetisation, advertising, bank connections, brokerage access, cloud sync, AI trade execution or compulsory registration as part of this plan. Any future change to those promises requires a separate product and privacy decision.

---

## 1. Repository alignment: verified baseline

This plan was aligned against the repository tree, current `main` head, source files and project instructions. The following are observations, not assumptions.

### 1.1 Existing technology and project structure

- Existing website: Vite + TanStack Start + React + TypeScript + Tailwind.
- Server/runtime configuration is wrapped by `@lovable.dev/vite-tanstack-config`; do not duplicate its integrated Vite/TanStack/Nitro plugins.
- Supabase integration and Drizzle/PostgreSQL configuration are present. Inspect actual usage before expanding backend responsibilities.
- The repository is connected to Lovable. Normal commits to the connected branch sync into the editor. Never force-push, rebase, amend or squash already-published history.
- `bun.lock` and `bunfig.toml` are committed. The Vercel deployment record [`dpl_9A3S1DNMhCaw7XbWJxAwQckjnhvh`](https://vercel.com/boxont/skyco/9A3S1DNMhCaw7XbWJxAwQckjnhvh) is `READY`, has target `production`, and points to `main` commit [`64f6d364`](https://github.com/eboxont-code/skyco/commit/64f6d3645c623d743ac90588581b97bf652af3db). Its build log cloned that exact commit and recorded `bun install v1.3.14`; Bun 1.3.14 is therefore the canonical package-manager version for this observed deployment and is documented in README. This does not establish public-domain routing, runtime-variable completeness or the full hosting configuration. Do not add a second lockfile.
- On `main`, `package.json` defines `dev`, `build`, `build:dev`, `preview`, `lint` and `format`, but no `test` script.
- Existing test files use Node's `node:test` API. PR #1 proposes a Bun test command; it is not yet integrated on `main`. Its latest CI run (`42213036495`) passed locked installation, 29 tests across 8 files and the production build, but ESLint failed with 1,606 Prettier errors and 10 warnings. Keep that lint failure visible; do not weaken the gate or mass-format unrelated files.
- `main` contains `.github/workflows/secret-history-scan.yml`, which covers the historical Gitleaks scan only. The general install/lint/test/build CI workflow is proposed on open PR #1 and is not yet integrated or green on `main`.
- `roadmap.md` is a dated web-work backlog with completed and incomplete historical item IDs. Preserve its history; do not recreate completed work or mark vague items complete without their original specification and evidence.

### 1.2 Current product inventory

The source registry in `src/lib/projects.ts` is the current hub directory and defines five shipped first-party routes:

| Product | Current route | Verified scope to preserve |
|---|---|---|
| CurrenSee | `/currensee` | Fiat/crypto reference-rate conversion, source/time labels, history chart, favourites/default pair, saved conversion snapshots and foreground rate alerts |
| Chronos | `/chronos` | Seven calendar readings, date navigation, date difference, age calculation, copy/share and monthly observances |
| My Finance Friend | `/finance-friend` | Deterministic local plain-English trade parser, editable/inspectable preview, session-only list and CSV copy |
| SkyCo Grocery Packs | `/grocery` | Sample packs, household sizing, checked items, print/share; browser persistence is used where available |
| Float | `/float` | Income, bills and BNPL planning over week/fortnight/month, recurring entries, guest mode and share link |

Two entries are planned, not shipped: **Budget & Expenses** and **Daily Notes**. Do not represent them as live or put empty placeholder modules into Android 1.0.

All shipped products belong under `skyco.online/<product>`. The historical proposal to redirect `currensee.skyco.online` and `chronos.skyco.online` is retained in `roadmap.md` with an explicit **SUPERSEDED — DO NOT EXECUTE** label; it is not part of the current architecture. Do not infer that DNS or hosting redirects exist: their live state remains unverified until the production host is identified.

### 1.3 Confirmed mismatches and risks to resolve

| Priority | Finding | Required response |
|---|---|---|
| P0 | A root `.env` file is tracked in Git. Its values were intentionally not opened or reproduced during this audit. | Run a secret scan without printing values. Determine whether it contains live credentials. Rotate exposed credentials and stop tracking local secrets. Do not rewrite published history as part of this plan; history remediation needs a separate, deliberate decision because the repo is Lovable-connected. |
| P0 | Privacy and security pages do not fully describe current product behaviour; Float is omitted from their product coverage/table. | Reconcile every statement with the source code. Document Float guest-mode browser storage, sharing behaviour, Grocery persistence and CurrenSee preferences/saved snapshots. |
| P0 | Float share links encode entered income, bills and BNPL details into a URL payload using Base64 URL-safe encoding. Base64 is not encryption. | Warn before sharing; explain that the link contains the selected figures and can be copied, logged or forwarded. Evaluate a safer opt-in share design. Never claim that the current share payload is encrypted. |
| P1 | Chronos supports seven systems in its UI, including Indian Saka, while some registry copy and the route title still say six. | Make product registry, title, descriptions, FAQs, metadata and UI consistently say seven. |
| P1 | The custom `CalendarSystem` type contains six systems; Indian Saka is formatted through `Intl.DateTimeFormat` in the UI. | Treat the seven-calendar engine as mixed implementation today. Test Android ICU/runtime compatibility and make output deterministic before choosing a Flutter implementation. |
| P1 | `AGENTS.md` says product paths are four route literals; the registry has five shipped route literals. | Correct the instruction to five and keep it aligned with the registry. |
| P1 | Status page explicitly says “published” means a working route, not continuous uptime monitoring. Its manual rate check is not full-site monitoring. | Preserve honest status wording. Add independent monitors only when they are actually running and their scope/retention is documented. |
| P1 | README lists `skyco.lovable.app` as the live app while the canonical hub is `https://skyco.online`. | Update the README canonical URL and add links to the project plan and working backlog. |
| P1 | Existing tests are present but no test script or CI workflow is defined. | Make the test command reproducible, add CI and publish the actual checks that pass. |
| P2 | Current CurrenSee `getRate` is a TanStack Start server function, not a separately documented public/versioned mobile API contract. | Add a stable, documented mobile-facing HTTP contract before the app depends on it. Do not guess internal routes or scrape website HTML. |

### 1.4 Current implementation details that must remain true unless deliberately changed

- CurrenSee currently sources fiat rates from Frankfurter, crypto data from CoinGecko, and selected NPR/pegged-currency references from Nepal Rastra Bank. NPR fallback may be derived from INR at the official 1.6 peg and is explicitly labelled. QAR/AED/SAR require the supported NRB source; do not invent replacement values on failure.
- The current rate service has a bounded 60-second per-pair cache; NRB payload data is cached hourly. Preserve source timestamps, reference dates and source attribution in any mobile contract.
- CurrenSee preference/history/alert helpers use optional browser storage. The UI must continue working if browser storage is blocked.
- Chronos uses a mix of custom code, `Intl` calendar support and the Nepali date converter. Selected dates are handled around UTC noon to avoid date shifts. Hijri and Nepali observance dates can differ from local moon-sighting or panchang decisions; retain those caveats.
- My Finance Friend is a deterministic parser preview, not an AI investment adviser, portfolio service, broker or trading engine. Session entries are not durable storage.
- Grocery pack selections and household size use optional browser storage. Grocery must remain usable if storage is unavailable.
- Float begins with sample values. User-entered figures persist in the browser only after the visitor chooses guest mode. The current guest implementation uses browser local storage without application-level encryption. The share URL carries encoded data. Neither behaviour may be described as encrypted or cloud-synchronised.
- Current SkyCo product behaviour and privacy claims must be based on code that ships, not on an aspirational plan.

---

## 2. Product and architecture decisions

These are the delivery defaults. A change requires a short decision record in the plan or repository documentation.

### 2.1 One application, five independent modules

Ship one Android app named **SkyCo**, with five independent feature modules:

1. CurrenSee
2. Chronos
3. My Finance Friend
4. SkyCo Grocery Packs
5. Float

The app shell owns home, tool discovery, navigation, common settings, theme, help and app-level error handling. Each tool owns its own domain rules, state and tests.

Do not publish five separate Android apps in the first release. Do not merge the tools into one tangled feature or shared data model.

### 2.2 Website remains first-class

- Keep the existing TanStack Start website and canonical first-party routes.
- Do not replace product routes with redirects to the app.
- Do not make installation mandatory.
- Keep each website product useful without the Android app.
- Add Android App Links only after the domain association file and app manifest are validated. Installed Android devices may open the app; everyone else must continue to reach the website.
- Avoid a WebView-only shell. The Flutter UI must be native Flutter UI with platform-appropriate Android interaction patterns.

### 2.3 Shared services versus local-first modules

| Product | Initial Android data strategy |
|---|---|
| CurrenSee | Server-mediated public market/reference data; cache with source and freshness metadata |
| Chronos | Local calculation where parity is proven; versioned reference fixtures; no user account |
| My Finance Friend | Local deterministic parser; session-only history by default |
| Grocery Packs | Bundled sample packs and local list state; offline-first |
| Float | Local-first private records; encrypted local persistence before durable-save release; no automatic cloud sync |

No amount, name, trade sentence, date of birth or Float record should be sent to the server unless that specific transfer is required, disclosed and explicitly approved by the user.

### 2.4 Mobile-facing API contract

Do not expose internal TanStack Start implementation details as a public API. Before Flutter integration, design a small versioned HTTP contract (for example, `/api/v1/rates`) and document it.

The contract must:
- Validate currency codes against an explicit allowlist.
- Return the numeric rate, from/to codes, source, reference date (`asOf`), server fetch time (`fetchedAt`), approximation/fallback status and available historical points.
- Distinguish provider failure, unsupported pair, rate-limited response and empty history.
- Never label a stale/cached value as newly fetched.
- State reference-rate limitations clearly; a reference rate is not an executable cash/card/crypto trading quote.
- Apply bounded caching, sensible timeouts, rate limits and safe error responses.
- Avoid embedding provider credentials or server secrets in the APK.
- Include a versioning/deprecation policy and machine-readable examples.
- Be tested against the existing website's source-backed fixtures.

Chronos, Finance Friend, Grocery and Float do not need a server API for their initial core job. Do not add a backend merely for architectural symmetry.

---

## 3. Delivery phases and master checklist

**Checklist rule:** all new work starts unchecked. Check an item only after implementation, the relevant test, and any required deployment or manual verification have actually passed. Put evidence in the commit/PR or linked test report. “Code written” is not “done”.

### Task eligibility and phase-gate interpretation

The phases define delivery priority, dependencies and completion criteria. **A phase exit gate is not automatically a blanket stop on every independent task in a later phase.** Keep every unsatisfied gate open, but apply it only to work that actually depends on that gate.

At the start of each run:

1. Start with the earliest unfinished phase and inspect its unchecked items in priority order. For each candidate, identify its direct prerequisites from the plan, repository instructions, source and acceptance criteria.
2. Classify each candidate as **eligible** or **blocked**. A task is eligible only when its own prerequisites are satisfied, it can be completed and verified safely with available access/tools, and it does not rely on an unresolved gate.
3. A blocked task or gate prevents (a) marking the relevant phase complete, (b) starting work that consumes the missing evidence or depends on the missing capability, and (c) any merge, production publish or deployment that the unresolved safety/release conditions prohibit. It does not block an independent task merely because that task appears in a later-numbered phase.
4. When a candidate is blocked, record the exact missing dependency and evidence, then continue down the existing priority-ordered checklist. Do not assume that every item in the phase shares the same blocker. Do not invent replacement scope.
5. While Phase 0 remains open, independent **Phase 1 website** source audits, factual copy/metadata corrections, privacy disclosures based on verified implementation, accessibility/SEO work, focused tests and other self-contained web changes may proceed when their own acceptance criteria do not require the missing hosting, Lovable, deployment-toolchain or CI-baseline evidence. Inspect the relevant implementation and tests first. Use a short-lived branch and PR for application, privacy, security or multi-file changes in accordance with `AGENTS.md`; do not merge or deploy. A narrow documentation-only correction may follow the direct-to-main exception in `AGENTS.md`.
6. The Phase 0 exit gate remains mandatory before declaring Phase 0 complete and before any dependent integration/release activity. Do not claim hosting variables, production toolchain, Lovable sync, test/CI baseline or release readiness are verified until their stated evidence exists. Do not bypass the gate for Android, shared-service/API or other work that relies on Phase 0 or Phase 1 outputs.
7. The same dependency test applies to later phases: phase order remains the priority order, and each later phase's own exit gates remain binding. This clarification does not authorize skipping required website, API, fixture, Android or release prerequisites.
8. Do not report “no eligible task” until the remaining unchecked items in the active phase(s) have been considered against their actual prerequisites and at least one plausible independent task has been checked where one exists. If none qualifies, state why each highest-priority candidate is blocked and name the exact evidence that would unlock it.

**Phase 0 completion gate:** secrets must be assessed and contained; install, lint, tests and build must be reproducible with their actual results recorded; and the shared/Lovable-connected Git history and sync protections must be established. The gate stays open until its checklist and evidence are complete. It blocks Phase 0 completion and work that depends on those assurances; it does **not** freeze independent Phase 1 website development that can be safely isolated, reviewed and verified without them. Production release/deployment remains prohibited while the actual production host, deployment configuration or required release checks are unresolved.

### Phase 0 — repository safety and project governance (P0)

- [x] Review repository history and current branch before making product changes; re-verified 9 November 2026: `main` HEAD is [`1ad3297173bcb60c8946f796640e7b146e58ab08`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08), 13 PRs are open (#1, #5, #6, #10–#19), no non-PR issues are open, and the branch API reports `protected=false` with no required status checks. The GitHub connection exposes no local checkout or working-tree status.
- [x] Secret-scan the tracked `.env` file and repository history without copying secret values into issues, logs or AI prompts; Gitleaks v8.30.1 scanned full reachable history on 6 November 2026 and reported no leaks (Actions run `42201818522`).
- [x] Review Gitleaks findings for committed credentials; no findings were reported, so no credential owner/scope/rotation follow-up was triggered by this scan. Hosting logs and runtime credentials remain a separate review.
- [x] Add `.env` / `.env.*` ignore rules (while allowing `.env.example`) and add a placeholder-only `.env.example`; verified on main 5 November 2026.
- [ ] Confirm deployment/runtime variables are configured in the hosting platform, not committed to Git. **Partially verified / BLOCKED:** the Vercel `skyco` project (`prj_CrMEll4wiFdvdcKKjkfUgUWXnAHr`) is linked to this repository. Its verified project domains are `skyco.online` and `www.skyco.online`, and both are aliases on the latest READY production-target deployment. Public requests to both origins return HTTP 200 from Vercel. However, project metadata reports `live=false`; the latest READY production deployment is for older main commit [`760d810`](https://github.com/eboxont-code/skyco/commit/760d810ceec331c39b8d4a106a3d0fc8efda7537), current main [`1ad3297`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08) has no production deployment record, and the non-decrypted environment listing returns 0 visible and 0 hidden variables. Current source requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the browser client and `SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY` for the Float waitlist server path. **Blocked:** owner confirmation is still needed that this is the intended runtime and that the required configuration is present, or to identify another runtime. No values were read or changed.
- [ ] Confirm `main` remains a working Lovable-connected branch; use normal commits only. **Blocked:** the only accessible workspace, `Bear's Lovable`, lists `BearBreaker` and `Mtdgc` but no SkyCo project. The SkyCo project ID recorded in README returns 404. Access to the correct SkyCo workspace/project is still required to verify the Git connection and sync status.
- [x] Establish branch/PR and rollback conventions in `AGENTS.md`; explicitly preserve Lovable-connected history and document safe revert/deployment recovery rules (6 November 2026).
- [x] Choose and document the canonical package manager: **Bun 1.3.14**. Verified from the READY Vercel deployment record [`dpl_9A3S1DNMhCaw7XbWJxAwQckjnhvh`](https://vercel.com/boxont/skyco/9A3S1DNMhCaw7XbWJxAwQckjnhvh), target `production`, for main commit [`64f6d364`](https://github.com/eboxont-code/skyco/commit/64f6d3645c623d743ac90588581b97bf652af3db); its build log records `bun install v1.3.14`. README now documents the observed version. This verifies the package-manager version used by that build only; it does not close the separate host, runtime-variable, Lovable-sync or CI/lint gates.
- [ ] Add a reproducible test command for existing Node tests. **Implemented on open PR #1, not yet on `main`:** the latest run passed 29 tests across 8 files.
- [ ] Add CI for install, lint, test and production build; do not claim CI coverage until a workflow exists and passes. **Implemented on open PR #1, not yet on `main`:** run `42213036495` passed unit tests and production build, but ESLint failed on 1,606 existing Prettier errors and 10 warnings. Keep the lint gate open; do not disable lint or mass-format unrelated files.
- [ ] Record the baseline website build, lint and test results before product changes. **Evidence is recorded on open PR #1 but is not yet integrated on `main`;** tests/build pass and the existing lint baseline fails as noted above.
- [x] Maintain a short Architecture Decision Record for material changes; accepted decision `docs/decisions/ADR-0001-website-and-android-boundary.md` records the website/native Android boundary and delivery constraints (7 November 2026).



### Phase 1 — website correctness, privacy and experience (P0/P1)

#### Product inventory and copy

- [x] Treat `src/lib/projects.ts` as the product registry source of truth; verified the five shipped first-party route literals and planned-only Budget & Expenses / Daily Notes entries on 6 November 2026.
- [x] Correct Chronos registry job/tagline/copy from six to seven systems. 8 November 2026: registry job, tagline, demo, description and example include all seven, including Nepali Bikram Sambat; home and generated llms.txt verified.
- [x] Correct the Chronos page title and all stale six-calendar text. 8 November 2026: title/OG/Twitter share the corrected seven-calendar title; corrected comments and historic count wording without inventing historical features; refreshed the existing home screenshot. Chronos date navigation and preserved moon-sighting/panchang caveats verified at 390px then 1280px, no overflow; preview build green.
- [x] Verify all five shipped product cards and routes point to `skyco.online/<product>`; 7 November 2026: registry slugs/paths, typed ToolsGrid links, route declarations, canonical/OG/SoftwareApplication URLs and sitemap entries match `/currensee`, `/chronos`, `/finance-friend`, `/grocery` and `/float`. Live home-card click-through opened all five expected pages.
- [x] Keep Budget & Expenses and Daily Notes clearly planned, not live. 8 November 2026: home explicitly says "Planned, not yet available"; both entries have no shipped paths or candidates. Two registry tests pass; all five existing card destinations and route canonical URLs verified at 390px then 1280px, with card actions at least 44px. No deployment.
- [x] Remove obsolete separate-subdomain instructions from active project guidance; retain history with a clear superseded label. 7 November 2026: README and AGENTS.md already specify the first-party hub; corrected §1.2 to reference the actual historical proposal in `roadmap.md` (the referenced `.lovable/plan.md` path is absent from the current tree), labelled that proposal superseded/do-not-execute, and retained the original mapping. No DNS or hosting redirect state is claimed or changed.
- [x] Align README's canonical live URL with `https://skyco.online`; verified in `README.md` on 6 November 2026.
- [x] Add project-document links to README: `MASTER_PLAN.md`, `roadmap.md`, `AGENTS.md`; all three links verified on 6 November 2026.

#### Privacy and security claims

- [x] Re-audit every product's browser/device/server/third-party data flow from code. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Update `/privacy` to cover all five shipped tools, including Float. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Update `/security` table to cover all five shipped tools. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Document CurrenSee favorites, defaults, saved snapshots, alert preferences and alert history in browser storage accurately. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Document Grocery per-pack checked items and household-size persistence accurately. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Document Float's opt-in guest-mode local storage accurately, including the fact that current browser storage is not application-level encrypted. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Document Float share-link contents and Base64's lack of confidentiality. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Add a clear pre-share disclosure and explicit confirmation for Float share links, or replace the current mechanism after a tested privacy design. 9 November 2026: explicit "I understand, create link" action; 390px then 1280px checks confirm >=44px actions, trapped focus, Cancel/Escape without sharing, confirmed device-share/clipboard and link readback; two payload tests pass.
- [x] Document support email handling, hosting logs and each third-party rate provider based on current implementation. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Ensure no page claims that data is never stored if the product stores it locally. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [x] Ensure no page claims encryption, continuous monitoring, authentication or sync unless the feature is implemented and verified. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [ ] Re-check all claims after any change to local storage, API calls or third-party SDKs.

#### Reliability, accessibility and SEO

- [x] Keep the Status page's distinction between a published route and uptime monitoring. 9 November 2026: inspected shipped storage/provider/contact code; trust pages verified at 390px then 1280px, 46 tests pass, scoped lint has no errors and preview build green.
- [ ] Decide whether to add independent uptime checks; if added, define probe scope, schedule, alert destination and retention.
- [ ] Add explicit rate-service freshness/provider failure monitoring only after the monitor exists.
- [ ] Check all five product flows on narrow Android-sized browser viewports and desktop.
- [ ] Check keyboard navigation, focus order, screen reader labels, contrast and text scaling.
- [ ] Verify SEO titles, canonical URLs, structured data, sitemap and `llms.txt` reflect the five live routes and two planned entries. **Source/preview evidence:** PR #12's two focused test files cover all five shipped product routes, the project/pair/Float registries, sitemap and robots. The earlier 14/14 fixture result in §38 was invalid because its source-derived pair fixture omitted five `PAIRS` entries whose property keys are written as quoted `"slug"`. The full registry contains 34 pair entries, and current `main`'s 59-URL sitemap includes all 34. PR #12's proposed 54-URL sitemap was therefore restored to match `main`; a corrected isolated Node 22.16 fixture run passed 14/14. This is not a Bun 1.3.14 or full-repository run. Public HTTP evidence from 9 November 2026 recorded the apex and `www` sitemap, `robots.txt` and `llms.txt` returning HTTP 200; no new live fetch was performed in §39. Public `llms.txt` still labels upcoming products “On the way”; PR #5 separately proposes “Planned — not live yet”. Keep this item unchecked until Phase 0 release gates permit release and post-release crawler/rendered-metadata verification passes.
- [ ] Confirm install hints and PWA metadata do not promise native app features.

**Exit gate:** published website behaviour, product registry, metadata and trust pages agree with the implementation; no unresolved P0 privacy/security issue remains.

### Phase 2 — shared rules, fixtures and API readiness (P0/P1)

- [ ] Map the existing CurrenSee request/response path from browser to TanStack Start server function to provider.
- [ ] Define and document the versioned rate HTTP contract for Flutter.
- [ ] Keep third-party fetches server-side; do not put secrets in mobile source or assets.
- [ ] Preserve Frankfurter, CoinGecko and NRB source attribution and the existing NRB fallback rules.
- [ ] Preserve the 60-second pair cache and hourly NRB payload cache unless measurements justify a documented change.
- [ ] Add deterministic rate fixtures for supported pairs, missing values, NRB unavailable, provider timeout, 429, malformed payload and empty history.
- [ ] Define rate freshness behaviour and the UI's exact stale/unavailable labels.
- [ ] Create golden JSON fixtures for all seven Chronos readings across representative years, month boundaries, leap conditions and timezone boundaries.
- [ ] Explicitly test Indian Saka on Android-supported runtimes; do not assume browser `Intl` output automatically matches Dart/Android.
- [ ] Create parser fixtures for valid, ambiguous, malformed, missing-price and missing-date trade descriptions.
- [ ] Create grocery pack fixtures and tests for household sizes 1, 2, 4 and 6, list persistence and storage-unavailable behaviour.
- [ ] Create Float fixtures for weekly, fortnightly, monthly recurrence, month-end clamping, date boundaries, negative balances, empty inputs and invalid inputs.
- [ ] Define Float export/import format and threat model before adding mobile persistence.
- [ ] Create a written parity matrix: website expected output vs service/API vs Android expected output.

**Exit gate:** mobile-facing interfaces and golden fixtures are versioned, documented, deterministic and tested. No app module relies on scraping the website.

### Phase 3 — Flutter/Android foundation on Windows (P1)

- [ ] Install the current stable Flutter SDK on Windows using the official setup guide.
- [ ] Install Android Studio and the Android SDK/platform tools.
- [ ] Configure Android emulator acceleration or connect a physical Android test device.
- [ ] Verify `flutter doctor -v`, `flutter --version` and `flutter devices`.
- [ ] Create the Flutter project under a dedicated directory (proposed: `apps/skyco_app/`) without disturbing the existing web root.
- [ ] Pin and document the Flutter/Dart stable toolchain used for the app.
- [ ] Create app identifier, display name, icon, splash screen and brand tokens.
- [ ] Create the app shell: Home, Tools and Settings.
- [ ] Create independent routes and feature boundaries for the five products.
- [ ] Establish state management, navigation, dependency injection and repository conventions; choose packages only after review.
- [ ] Add shared loading, empty, offline, error and retry components.
- [ ] Add theme support and accessible font scaling.
- [ ] Define local persistence interfaces and migration/version strategy.
- [ ] Add unit/widget/integration test conventions and CI validation for Flutter.
- [ ] Add a clear Windows development guide to the repository.
- [ ] Ensure generated build output, local databases, keystores, signing credentials and machine-specific files are ignored by Git.

**Exit gate:** a clean Android build runs on emulator and physical device from Windows; app shell routes work; CI can analyze and test it.

### Phase 4 — Android product modules (P1/P2)

#### 4A. CurrenSee — first module

- [ ] Implement fiat and supported crypto selectors from the authoritative currency list.
- [ ] Implement amount entry, conversion and swap.
- [ ] Implement source, reference date and fetched-at labels.
- [ ] Implement 7-day/30-day history only when source points exist; never fabricate missing days.
- [ ] Implement favourites, default pair and saved conversion snapshots.
- [ ] Preserve the displayed saved result and source metadata; never recompute a historic snapshot on refresh.
- [ ] Implement explicit unavailable, stale, approximate and provider-error states.
- [ ] Preserve NRB buy/sell midpoint/unit rules and labelled fallback behaviour.
- [ ] Implement foreground rate alerts first.
- [ ] Do not promise background alerts until a tested Android scheduling/push architecture exists.
- [ ] Verify every fixture against website behaviour and the documented rate API.

**Acceptance:** all supported fixtures match; provider failures are honest; rate source/date/freshness are visible; no amount or personal data is sent to the rate provider.

#### 4B. Chronos

- [ ] Implement Gregorian, Nepali Bikram Sambat, Hijri, Hebrew, Chinese, Persian and Indian Saka.
- [ ] Choose and document a deterministic calculation strategy for each system.
- [ ] Reuse existing TypeScript logic only as a behaviour reference; Dart code requires golden-fixture parity, not a line-by-line translation assumption.
- [ ] Verify selected-date timezone handling and date boundaries.
- [ ] Implement previous/next/today, date difference and age calculation.
- [ ] Implement month/observance view only for observances supported by verified data.
- [ ] Keep local moon-sighting and Nepali panchang caveats visible.
- [ ] Implement copy/share and optional Android calendar insertion with clear user action.
- [ ] Test on multiple Android versions/devices.

**Acceptance:** all seven systems match approved fixtures and caveats; unsupported runtime output produces a clear unavailable state, not a plausible but wrong date.

#### 4C. SkyCo Grocery Packs

- [ ] Port only the sample packs currently shipped on the website.
- [ ] Preserve sections and item ordering.
- [ ] Support household sizes currently available (1, 2, 4 and 6) and verify quantity rounding.
- [ ] Implement check/uncheck, remaining count, reset and completed-item filtering.
- [ ] Persist the user's list locally with versioned schema and safe migration.
- [ ] Remain useful when storage fails or the device is offline.
- [ ] Implement Android share/print flows using platform-appropriate mechanisms.
- [ ] Do not display supermarket prices without a reliable, licensed and current source.

**Acceptance:** packs and quantities match fixtures; selections survive normal restart; storage failure never blocks use.

#### 4D. My Finance Friend

- [ ] Port the deterministic parser, not an invented AI/LLM workflow.
- [ ] Parse action, quantity, ticker, optional price and supported date phrases.
- [ ] Mark assumed/defaulted values explicitly.
- [ ] Reject or request correction for ambiguous/malformed entries.
- [ ] Keep preview/session history local and non-durable by default.
- [ ] Implement CSV export/share only after the user initiates it.
- [ ] Do not add brokerage access, trade execution, recommendations or performance claims.

**Acceptance:** parser results match fixtures; missing facts are not guessed; session data is not silently persisted or uploaded.

#### 4E. Float — highest privacy scrutiny

- [ ] Port income, bills, BNPL, periods and recurrence rules from the current web behaviour.
- [ ] Preserve the distinction between sample mode and user-entered data.
- [ ] Decide whether Android should save by default or require an explicit “save on this device” action; make the choice visible.
- [ ] Implement encrypted local database storage only after selecting and reviewing an actively maintained implementation.
- [ ] Protect encryption keys using Android Keystore-backed storage.
- [ ] Exclude sensitive database contents from unsafe backup paths; document Android backup behaviour.
- [ ] Provide export, import, clear-all and delete flows with confirmation.
- [ ] Keep cloud sync, accounts and banking integrations out of Android 1.0.
- [ ] Reassess the current Base64 URL share design; disclose exactly which figures are included before using Android Sharesheet.
- [ ] Do not say Float is encrypted until tests verify encryption at rest and key handling on actual devices.

**Acceptance:** calculations match fixtures; records survive ordinary restart; database/key handling is verified; deletion works; no network request contains Float entries; share content is disclosed.

### Phase 5 — integration, security and quality (P1)

- [ ] Integrate all five modules into one app shell without cross-module state leakage.
- [ ] Add Android App Links for existing first-party product paths only after `/.well-known/assetlinks.json` and manifest verification.
- [ ] Ensure a product URL still works on the website when the app is absent.
- [ ] Add home-screen shortcuts only for stable, working destinations.
- [ ] Add notifications only for user-requested functions with clear permission rationale.
- [ ] Audit all Android permissions; remove anything not required.
- [ ] Review all Flutter packages, licences, maintainers, transitive dependencies and permissions.
- [ ] Threat-model Float storage/share, API transport, app links and update/signing.
- [ ] Test offline start, loss of connection, reconnect, slow data, malformed responses and provider outages.
- [ ] Test screen sizes, font scaling, TalkBack, keyboard/focus and contrast.
- [ ] Test app restart, process death, device rotation, background/foreground and low-memory recovery.
- [ ] Run unit, widget, integration, static analysis and release-build checks.
- [ ] Run web regression tests after shared API or product-rule changes.
- [ ] Record all known limitations and verify they are disclosed in the UI.

**Exit gate:** no open critical/high privacy or security defect; no critical calculation mismatch; app is stable on the agreed Android device matrix.

### Phase 6 — Google Play release (P1)

- [ ] Confirm current Play Console account type, identity verification and registration requirements.
- [ ] Confirm the current target API requirement immediately before submission. At this plan's creation date, the applicable new-app/update requirement is Android 16 / API 36 or higher; re-check Google's policy at release.
- [ ] Produce a signed release Android App Bundle (`.aab`) and a separately testable APK when needed.
- [ ] Protect upload/signing keys outside the repository and document recovery.
- [ ] Prepare app icon, screenshots, short/full descriptions and contact details.
- [ ] Publish a privacy policy that matches actual Android and SDK behaviour.
- [ ] Complete the Play Data safety form accurately, including third-party SDK collection and processing.
- [ ] Complete content rating, app access and permissions declarations as applicable.
- [ ] Run internal testing on real devices.
- [ ] If the account is a personal developer account subject to Google's post-13-November-2023 testing rule, complete the required closed test (currently 12 testers opted in continuously for 14 days) before applying for production access; verify the live rule in Play Console.
- [ ] Collect and triage tester feedback.
- [ ] Release gradually and monitor crashes, Android Vitals, user feedback and rate-service reliability.
- [ ] Maintain rollback/release notes and a support path.

**Acceptance:** Google Play accepts the listing; installed production build passes smoke tests; privacy declarations match observed behaviour.

### Phase 7 — post-launch and future scope (P2)

- [ ] Maintain website/app parity fixtures for every product change.
- [ ] Monitor crash rates and provider errors using a documented, privacy-minimising setup.
- [ ] Publish changelog entries for user-visible changes.
- [ ] Add Budget & Expenses only after a separate scope, privacy and overlap review with Float.
- [ ] Add Daily Notes only after a separate local-data and backup/privacy review.
- [ ] Consider cloud sync only with a full account, encryption, consent, deletion and support design.
- [ ] Keep Flutter dependencies and Android target requirements current.
- [ ] Consider iOS only as a separate future decision; the current project does not require a Mac or iOS build pipeline.

---

## 4. Release gates and definition of done

A phase is not complete because a screen exists. It is complete only when the evidence is recorded.

### Website gate

- [ ] Five live routes and two planned entries are represented accurately.
- [ ] No known P0 secret/privacy/security issue remains open.
- [ ] Privacy/security/status statements match shipped code.
- [ ] Production build, lint and defined tests pass.
- [ ] Mobile and desktop smoke tests pass.
- [ ] Canonical URL and metadata are correct.

### API gate

- [ ] Versioned contract, schema and error model are documented.
- [ ] Provider names, source dates and fetched timestamps are tested.
- [ ] Cache and rate-limit behaviour are bounded and documented.
- [ ] No provider secret is in the app bundle.
- [ ] Fixtures cover expected failures and fallbacks.

### Android gate

- [ ] Windows setup is reproducible from documentation.
- [ ] One app contains five independent modules.
- [ ] No WebView-only implementation.
- [ ] Local-first features work offline.
- [ ] Float's storage/share behaviour is disclosed and verified.
- [ ] All core calculations pass parity fixtures.
- [ ] No unnecessary permissions or silent collection.
- [ ] Unit/widget/integration tests and static analysis pass.
- [ ] Real-device smoke tests pass.

### Publication gate

- [ ] Release signing material is protected.
- [ ] Play policy and target API are rechecked.
- [ ] Privacy policy and Data safety are accurate.
- [ ] Required testing/account steps are complete.
- [ ] Staged rollout and rollback plan are ready.

---

## 5. GitHub execution rules

1. **Read these files at the start of every work session:** `AGENTS.md`, `MASTER_PLAN.md`, `roadmap.md`, then the specific source files being changed.
2. Inspect current `main`, uncommitted/local changes and open PRs before editing. Never assume an old audit is still current.
3. `AGENTS.md` contains immediate coding constraints; this file contains product scope and acceptance criteria; `roadmap.md` retains dated web tasks/history.
4. Do not blindly replace the historical roadmap with a new checklist. Link the documents and keep each purpose separate.
5. Use small, reviewable commits. The Lovable-connected branch must remain buildable.
6. Prefer a working branch and PR for multi-file implementation. Merge only after tests pass and the diff is reviewed.
7. Never force-push, amend, rebase or squash commits already published to the connected repository.
8. Never paste secrets, private user data, Float entries or full `.env` contents into issues, logs, commits or AI prompts.
9. Check a box only with evidence: test name/output, manual test notes, deployment URL or commit/PR reference.
10. Update the changelog and plan when user-visible behaviour or a release gate changes.
11. If code, plan and deployed website disagree, inspect the deployed build and source before deciding which one is authoritative; do not silently invent behaviour.
12. Do not mark a planned product or a future platform as shipped.

### Suggested GitHub labels

Use consistent labels if/when issues are created: `priority:P0`, `priority:P1`, `priority:P2`, `area:website`, `area:api`, `area:android`, `area:privacy`, `area:security`, `area:testing`, `area:release`.

Do not create duplicate issues for already-completed items in the dated `roadmap.md`.

---

## 6. Authoritative references

Use official documentation and re-check policy pages immediately before implementation/release:

- Flutter on Windows / Android setup: https://docs.flutter.dev/platform-integration/android/setup
- Flutter architecture guidance: https://docs.flutter.dev/app-architecture/guide
- Flutter Android deployment: https://docs.flutter.dev/deployment/android
- Android App Links: https://developer.android.com/training/app-links
- Android core app quality: https://developer.android.com/docs/quality-guidelines/core-app-quality
- Google Play target API requirements: https://developer.android.com/google/play/requirements/target-sdk
- Google Play testing requirements: https://support.google.com/googleplay/android-developer/answer/14151465
- Google Play Data safety: https://support.google.com/googleplay/android-developer/answer/10787469

**Policy and toolchain values are time-sensitive.** Confirm current stable Flutter/Dart, Android SDK and Google Play requirements at the time of work. Do not copy a version number from an old plan and assume it is still current.

---

## 7. Current status and delivery gates

- [x] Repository identified and current `main` inspected.
- [x] Existing website stack and repository instructions inspected.
- [x] Five live product routes and two planned products identified from the registry.
- [x] Important website/privacy/copy/testing mismatches recorded.
- [x] Historical web roadmap preserved as a separate document.
- [x] Remove the tracked root `.env` from the current main tree; add `.env.example` and ignore rules (commits recorded in the 5 November audit log).
- [x] P0 historical secret scan completed: Gitleaks v8.30.1 scanned full reachable history on 6 November 2026; no leaks found (run `42201818522`). No credential-specific rotation follow-up was triggered by this scan.
- [ ] P0 privacy/security documentation reconciliation.
- [ ] P1 website copy/registry correction.
- [ ] P1 reproducible test command and CI.
- [ ] P1 versioned mobile API contract.
- [ ] P1 Flutter Windows foundation.
- [ ] P1 five Android modules.
- [ ] P1 full quality and privacy gates.
- [ ] P1 Google Play release.

**Next action:** Phase 0 remains open. Runtime-variable verification still needs owner-confirmed public-host identity and read-only access to that host's runtime settings; the linked Vercel project has no production deployment for current `main` `1ad3297`, the latest READY production-target record is for older `760d810`, and the newer `cc3eefad` production attempt is CANCELED. Lovable sync still needs access to the correct SkyCo editor workspace. PR #1's reproducible test/CI workflow remains off `main`; the recorded lint baseline is 1,606 Prettier errors and 10 warnings, and the latest runner attempts failed before any job step. These gates do not freeze independent Phase 1 website work under Section 3. PR #12's source-level sitemap and five-product SEO tests are now verified in §38, but public crawler/rendered-metadata verification remains blocked by the SSO-protected preview and unconfirmed public origin. PR #15's PWA source assertions are already complete; its remaining browser installation, Safari Add to Home Screen and live-manifest checks need an accessible preview and confirmed public host. Next eligible source-only task: recheck PR #5's planned-product and generated `llms.txt` changes against current `main`, then run its six focused tests on the exact current source. Do not merge or deploy production while Phase 0 release evidence is incomplete.



## 9. Audit log — 6 November 2026

- [x] Documented branch naming, pull-request expectations, Lovable-connected main-branch constraints and non-destructive rollback conventions in `AGENTS.md`.
- [ ] Historical Gitleaks scan remained pending verification **at the time of this entry**; this was superseded by the successful 6 November run documented in section 11 (Actions run `42201818522`, Gitleaks v8.30.1).
- [ ] Hosting runtime-variable verification remains pending. No Vercel project matching `eboxont-code/skyco` or `skyco` was found, and the README's Lovable project ID was not accessible in the connected Lovable workspace. The actual production host is not established by these checks.

## 8. Audit log — 5 November 2026

Repository: eboxont-code/skyco (private), default branch main. The repository tree and current project instructions were inspected; the only branch returned was main. No open GitHub issues or pull requests were returned. The baseline head before this audit's changes was 14003f4b217bd5b6ea51b24bce349fb4039ed701 ("Add project north star").

### Completed repository-safety changes

- [x] Added .env.example with placeholder-only values for environment variable names referenced in code: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY, LOVABLE_DB_MIGRATION_URL, LOVABLE_CRON_SECRET and LOVABLE_CRON_SECRET_PREVIOUS.
- [x] Added .env and .env.* ignore rules while explicitly allowing .env.example.
- [x] Deleted the tracked root .env from the current branch without opening, printing or copying its values.
- [ ] Scan Git history and hosting logs for exposed credentials; rotate/revoke any affected values. The current-branch deletion does not erase prior commits.
- [ ] Confirm each required server-side variable in the actual Lovable/hosting runtime. A Vercel project search by repository and SkyCo/Currensee names returned no projects; this does not establish where the live site is hosted or whether runtime configuration is complete.

### Baseline and delivery notes

- The repository has a committed bun.lock and bunfig.toml, while the README previously instructed npm. Bun is the preferred local install workflow pending a clean Windows reproduction; no package-manager migration or dependency update was performed in this audit.
- package.json currently defines dev, build, build:dev, preview, lint and format; it does not define a test script. Existing .test.ts files use Node's node:test API. The supported test command still needs to be run and documented.
- No .github/workflows/ directory was present in the inspected tree. CI is not currently verified or configured by this audit.
- The current website is documented as https://skyco.online; the five shipped first-party product routes and two planned-only products are retained as described above.
- No deployment was triggered and no paid service or API was enabled.

### Commits created by this audit

- fb39978c326349c08b7764967c3555f8e57aee21 — add safe environment template.
- dbbb95ad081c145bf275b4ba0b5a3394147c2806 — ignore local environment files.
- debac1fc7467729092f4697393b0c1afca2cf2fa — stop tracking root .env.

### Post-change verification

- Latest inspected main head after this audit's README update: 9edcd3344491c0759e7fcc13e0ae5c0056c629d1.
- [x] Re-read the recursive main tree: .env is absent; .env.example, .gitignore, MASTER_PLAN.md and README.md are present.
- [x] Re-checked open issues and pull requests: none returned.
- [x] Re-checked GitHub Actions: zero workflow runs returned and no .github/workflows files exist in the tree.
- [ ] Branch protection remains unverified: the GitHub integration returned 403 for the branch-protection endpoint. Do not infer that main is protected or unprotected.
- [ ] GitHub secret-scanning alert inventory was not available through the connected GitHub integration. A clean secret scan has not been established.

## 11. Audit log — 6 November 2026 — historical secret scan

- [x] Ran the Historical secret scan workflow on `main` commit `a7e6fa916c4637464f141a282f3813ee8e2658fd` (Actions run `42201818522`, Gitleaks `v8.30.1`). The workflow checked out complete history (`fetch-depth: 0`) and ran `gitleaks git . --log-opts=--all --redact=100 --no-banner`. The job and scan step completed successfully; the redacted log reported `no leaks found`. No secret values were opened or copied.
- [x] No Gitleaks findings were reported, so no credential-specific owner/scope/rotation action was triggered by this scan. This does not assess hosting logs, runtime variables or values outside the scanner's detection rules.
- [x] Current repository snapshot: `main` HEAD `407e22d4e3101e7845168a623ccf65b79a692179`; branch API reports `protected=false` and no required status checks; no open issues; PR #1 is open and PR #3 is an open draft.
- [ ] Hosting runtime-variable verification remains blocked: the exact production host/project identity and read-only access to its environment-variable settings are missing. No environment configuration was changed.
- [ ] Lovable connection/sync verification remains blocked: read-only access to the connected Lovable project workspace is missing.
- [ ] Canonical package-manager selection remains blocked: access to the actual production build/deployment configuration or build logs is missing.
- PR #1 (`test/reproducible-bun-tests`) remains open. Its latest CI run `42213036495` passed 29/29 tests and the production build; ESLint failed on 1,606 existing Prettier errors and 10 warnings. The test command and CI workflow are not yet on `main`.
- PR #3 (`docs/privacy-security-reconcile`) remains a draft. No Actions run was present for it in the inspected run list; automated checks have not been established for this draft.
- Next independent Phase 0 task: add a concise ADR documenting the already-approved boundary between the existing TanStack website and the separate native Flutter Android client. This is documentation-only and does not require account access.


## 12. Audit log — 7 November 2026 — architecture boundary ADR

- [x] Added accepted ADR-0001 at `docs/decisions/ADR-0001-website-and-android-boundary.md`. It records the existing TanStack website as first-class, one separate native Flutter Android client under `apps/skyco_app/`, the five independent modules, Windows/Android-only delivery scope, CurrenSee's versioned API prerequisite, local-first boundaries and explicit non-goals.
- [x] Verified the ADR is present on `main` and its two relative repository links resolve to `MASTER_PLAN.md` and `AGENTS.md`. Structural checks confirmed the five module names, accepted status, Windows/Android scope, native-not-WebView boundary, versioned API prerequisite, privacy constraints and acceptance checklist.
- [x] Repository state when the ADR was committed: `main` HEAD `d1f191b806c6d0521692225e4165eec98464981f`; no open issues; PR #1 remained open and PR #3 remained an open draft. The following master-plan commit records this evidence.
- No application source or runtime behaviour changed. Application lint, tests and production build were not run for this documentation-only change; the documentation-specific content and internal-link checks above passed.
- Phase 0 items still blocked: hosting runtime-variable verification needs the production host/project identity and read-only environment-settings access; Lovable sync verification needs read-only workspace access; canonical package-manager confirmation needs production build configuration/logs. PR #1 remains unmerged with a failing existing lint baseline (1,606 Prettier errors and 10 warnings); do not disable lint or mass-format unrelated files.
- No further independent Phase 0 task is currently safe to execute without those inputs or maintainer review. Keep later phases deferred and re-evaluate for newly available, independent work on subsequent runs.


## 13. Repository re-check — 7 November 2026

- Re-read `README.md`, `AGENTS.md`, this plan and `roadmap.md`; rechecked the private repository's `main` head, branches, open issues and pull requests. `main` HEAD is `45882075334e8b55c924d79d3e3575b0ef05959e`; there are no open issues. PR #1 is open and not draft; PR #3 is open and remains draft. Neither PR has submitted reviews or inline review threads.
- PR #1 head `8f92c2ccf18afb3027c1a13bab07ed1932eb724c` has one PR-triggered CI run, `42213036495`: locked install passed, unit tests passed (29 across 8 files), production build passed, and ESLint failed (1,606 errors and 10 warnings). PR #3 head `a0e319e4e8dd3d4167ecc16f45529786d11f9ad2` has no PR-triggered workflow run. No PR was merged or changed during this audit.
- Corrected §1.1 so its local Bun workflow and workflow-directory statements describe current `main`, while the production toolchain remains explicitly unverified. No checklist item was marked complete and no application code or behaviour changed.
- Documentation verification: the four stale baseline statements each had exactly one match and were replaced once. No application lint, tests or build were run because this was a documentation-only correction.
## 14. Repository re-check — 7 November 2026 — current execution state

- Re-read `README.md`, `AGENTS.md`, this master plan and `roadmap.md`. Current `main` is `4bab8b4e107725a36294b2cfba895bb88261b6bb`; the remote tree is readable, but no local checkout/working-tree state is exposed in this execution environment. `package.json` on main still has no `test` script and defines `lint` as `eslint .`. The only workflow on main is `.github/workflows/secret-history-scan.yml`; general install/lint/test/build CI is not integrated on main.
- No open GitHub issues were returned. PR #1 remains open (not draft), head `8f92c2ccf18afb3027c1a13bab07ed1932eb724c`, base `14efbcc2724a06a4de41d7c5f13913a6d77341c3`, and GitHub currently reports `mergeable=false`, `mergeable_state=dirty`. Its latest recorded CI run `42213036495` failed overall: frozen install, 29 tests across 8 files and production build passed; ESLint failed on 1,606 Prettier errors and 10 warnings. The PR branch is not based on current `main`; do not rebase or rewrite its published history. It needs a non-destructive branch reconciliation and a verified lint resolution before it can be considered ready; maintainer review/approval is also required before merge.
- PR #3 remains open as a draft, head `a0e319e4e8dd3d4167ecc16f45529786d11f9ad2`, with base `407e22d4e3101e7845168a623ccf65b79a692179` and three changed documentation files. GitHub reported it mergeable during the initial inspection, but a subsequent read-only check returned `mergeable=false`; the reason is not established. No PR-triggered workflow run is present in the inspected Actions run list. The privacy/security checklist remains unchecked: branch-file/source-text inspection is not a substitute for required automated verification or review.
- Recent GitHub Actions history contains only the successful historical secret scan (`42201818522`) and the three failed PR #1 CI attempts (`42212142197`, `42212470384`, `42213036495`). No deployment record was established through the available repository/CI evidence.
- Read-only Vercel Git deployment discovery returned the accessible Boxont Hobby team's linked projects (`mtdgc`, `neighbourhood-guidebook`, `bearbreaker`) and no `skyco` project. This does not identify the actual production host or prove that SkyCo is not hosted elsewhere; production host identity and deployment evidence remain unknown. No hosting configuration or environment values were read or changed.
- Phase 0 remains open. Owner-only blockers: (1) exact production host/project identity plus read-only runtime environment access; (2) read-only access to the connected Lovable workspace to verify sync; (3) production build/deployment configuration or logs to confirm the canonical deployed package manager. PR #1 additionally requires a narrow, verified lint fix, non-destructive reconciliation with current main and maintainer review; PR #3 requires project-toolchain checks and review. Do not retry these unchanged dependencies or merge either PR without approval.
- **Next eligible task:** none is currently confirmed within the authoritative phase order. Phase 1 and later phases remain deferred by the Phase 0 exit gate; the listed Phase 0 tasks require the missing owner access, maintainer review, or a verified lint/build environment. Re-evaluate only when new repository evidence, CI results, an updated PR branch, or owner-provided access changes those prerequisites. Do not invent unrelated work to bypass the gate.

## 15. Repository re-check — 7 November 2026 — connected workspace and deployment evidence

- Re-read `README.md`, `AGENTS.md`, this master plan and `roadmap.md`. Current remote `main` HEAD is `469f01365f6cd1f511506bc0c6d54c50d394cccd`. GitHub lists `main`, `test/reproducible-bun-tests`, `docs/privacy-security-reconcile` and `docs/skyco-brand-expansion-plan`; all report unprotected. No open issues were returned. The remote repository can be inspected, but this execution environment exposes no local checkout or local working-tree status.
- PR #1 remains open and non-draft: head `8f92c2ccf18afb3027c1a13bab07ed1932eb724c`, base `14efbcc2724a06a4de41d7c5f13913a6d77341c3`, `mergeable=false`, `mergeable_state=dirty`. It has no reviews or review comments. Its latest PR workflow run is `42213036495`: ESLint failed, TypeScript tests passed (29/29 across 8 files), and the production build passed. Do not rebase or rewrite its published branch; do not mass-format unrelated files or weaken lint to make the job green.
- PR #3 remains open and draft: head `a0e319e4e8dd3d4167ecc16f45529786d11f9ad2`, base `407e22d4e3101e7845168a623ccf65b79a692179`, three documentation files changed, no reviews/comments and no PR-triggered workflow run. The raw GitHub pull-request endpoint currently reports `mergeable=true` / `mergeable_state=clean`, while the normalized PR fetch reports `mergeable=false`; this discrepancy is unresolved. Its draft status and lack of automated verification remain unchanged, so it is not ready for acceptance.
- `main` still has no `test` script in `package.json`; `lint` is `eslint .`. The only workflow on `main` is `.github/workflows/secret-history-scan.yml`; general install/lint/test/build CI is not integrated on `main`. The historical secret scan remains successful (run `42201818522`).
- Lovable access was rechecked using the connected account. The accessible `Bear's Lovable` workspace is owned by the account and contains two projects (`Mtdgc` and `BearBreaker`); a workspace search for `skyco` returns no project. The README's referenced project ID `3706605c-043c-43bf-a5d9-c50fe65c055d` returns `project_not_found`, and `.lovable/project.json` contains only template/revision metadata, not a project ID. **Lovable sync remains blocked:** the matching SkyCo project is not accessible in the connected workspace, so no claim about its Git connection or sync health can be made.
- Vercel's connected Boxont team exposes projects `mtdgc`, `neighbourhood-guidebook` and `bearbreaker`, but no `eboxont-code/skyco` project. Repository-filtered and `skyco` name searches returned zero projects; deployment lookups for app names `skyco` and `skyco.online` also returned zero records. This does not prove the live site is not deployed elsewhere. **Hosting verification remains blocked:** the actual production host/project identity and read-only access to its runtime-variable settings are still missing. No hosting settings, environment variables, DNS or production resources were changed.
- Phase 0 remains open. Its remaining executable items are blocked by the missing production host/configuration evidence, inaccessible Lovable project, and PR #1's dirty branch plus failing pre-existing lint baseline and required maintainer review. The canonical production package-manager choice also cannot be confirmed without the actual deployment configuration or build logs. Do not begin Phase 1 or Android work while the plan's Phase 0 exit gate is unmet.
- **Next eligible task:** none is currently confirmed. Reassess only when new evidence arrives (the correct SkyCo Lovable project becomes accessible, the production host/build configuration is identified, or PR #1 receives a safe branch reconciliation and verified lint resolution plus maintainer review). No application or production behaviour changed in this audit.


## 16. Repository re-check — 7 November 2026 — latest PR and workspace status

- Re-read `README.md`, `AGENTS.md`, this master plan and `roadmap.md`. The remote `main` HEAD at the start of this check was `d0d6beee21401c3b77d65cc2230944f4f0be87f9`; branch listing still shows the connected repository branches as unprotected. No local checkout or local working-tree status is exposed by this execution environment, so no clean/dirty working-tree claim is made. No open GitHub issues were returned.
- PR #1 remains open and non-draft (head `8f92c2ccf18afb3027c1a13bab07ed1932eb724c`; its base is `14efbcc2724a06a4de41d7c5f13913a6d77341c3`). The current `main...test/reproducible-bun-tests` comparison is diverged: 5 commits ahead and 17 behind. GitHub reports it not mergeable. Its latest run remains [42213036495](https://github.com/eboxont-code/skyco/actions/runs/42213036495): locked install passed, 29/29 tests passed across 8 files, and production build passed; the ESLint job failed with 1,606 `prettier/prettier` errors and 10 warnings. The PR changes no application source files, so the formatting diagnostics are in the existing application baseline. Do not mass-format unrelated files, weaken lint or rewrite the published branch.
- PR #3 remains open and draft (head `a0e319e4e8dd3d4167ecc16f45529786d11f9ad2`; its base is `407e22d4e3101e7845168a623ccf65b79a692179`). The current `main...docs/privacy-security-reconcile` comparison is diverged: 6 commits ahead and 10 behind. The latest PR fetch now reports `mergeable=true`, resolving the earlier disagreement between normalized and raw mergeability checks. It still has no reviews or review threads and no PR-triggered workflow run; it remains a draft and is not accepted or verified.
- Current `main` still has no `test` script in `package.json`; `lint` remains `eslint .`. The only workflow in `.github/workflows` is `secret-history-scan.yml`; general install/lint/test/build CI is not integrated on `main`. The PR #1 CI evidence is not a passing main-branch baseline.
- The accessible Lovable workspace remains `Bear's Lovable`; a current project search for `skyco` returns no project, and the README-referenced project ID `3706605c-043c-43bf-a5d9-c50fe65c055d` returns `project_not_found`. Lovable connection/sync verification therefore remains blocked.
- The connected Vercel team still lists only `mtdgc`, `neighbourhood-guidebook` and `bearbreaker`. Project searches for `skyco` and `skyco.online`, plus deployment searches for both app names, return zero records. This does not establish that the live site is undeployed or identify another provider. The actual production host, runtime-variable settings and deployed build configuration remain unknown.
- Phase 0 remains open. The owner-only dependencies are unchanged: identify the production host/project and provide read-only access to runtime configuration/build evidence; make the correct SkyCo Lovable project accessible for sync verification; and obtain the maintainer review/approval needed for the stale PRs. PR #1 also needs a non-destructive reconciliation and a verified lint resolution. PR #3 needs project-toolchain verification and review. Do not start Phase 1 or Android work while the Phase 0 exit gate is unmet.
- **Next eligible task:** none is currently confirmed. Reassess when one of the exact dependencies above changes; do not retry unchanged blockers or create unrelated scope to bypass the phase gate. This audit changed documentation only; no application code, production configuration, production data or deployment was changed. No application lint, tests or build were run.

## 17. Execution-policy correction — independent work behind an open phase gate

- Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md` against current `main`. The main commit at the start of this change was `7e5d3a0e5ee74f599898db17f7553ab5b729bfb1`. No local checkout or working-tree status is exposed in this execution environment. No open GitHub issues were returned; PR #1 remains open and PR #3 remains an open draft.
- The stall was caused by conflicting guidance: the task-selection rules said to continue with independent work, but the Phase 0 exit-gate wording and the previous audit's “do not start Phase 1” statement could be read as a global freeze. That interpretation incorrectly treated the Phase 0 gate as a prerequisite for every Phase 1 website task.
- Added the explicit task-eligibility policy above. Phase order remains the priority order; exit gates remain binding for phase completion and dependent work. Independent Phase 1 website tasks may now proceed on isolated branches/PRs when their own source-backed acceptance criteria do not depend on unresolved hosting, Lovable, deployment-toolchain or CI-baseline evidence. No gate is marked satisfied by this clarification.
- Phase 0 remains open. Its unresolved items and evidence remain as recorded in this plan: actual production host/runtime configuration; correct Lovable project and sync access; deployed build configuration/package-manager evidence; and integration/review of PR #1's reproducible test/CI work. PR #1's last observed CI result remains run [42213036495](https://github.com/eboxont-code/skyco/actions/runs/42213036495), with 29/29 tests and build passing but ESLint failing on the existing 1,606 Prettier errors and 10 warnings. PR #3 remains a draft and still needs toolchain verification and review.
- **Next eligible task to evaluate:** Phase 1, Product inventory and copy — “Correct Chronos registry job/tagline/copy from six to seven systems.” Current `src/lib/projects.ts` still says “six calendar systems” and omits Nepali (Bikram Sambat) in the Chronos registry description/demo, while `src/routes/chronos.tsx` and `src/components/experiences/ChronosCalendars.tsx` already describe or render seven systems. This is a self-contained, source-verifiable website-copy task and does not require the missing hosting or Lovable account evidence. On the next run, inspect its exact acceptance scope and existing tests, then implement only that task if no newer change or PR already covers it. Do not mark it complete without verification.
- This is a documentation and automation-instruction correction only. No application behaviour, phase checklist item, production configuration, production data or deployment was changed. No application tests, lint or build were run for this policy change.


## 18. Execution log — 7 November 2026 — supersede historical subdomain redirect proposal

- Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md`; inspected the current `main` branch, repository tree, open issues/PRs, recent Actions evidence and available Vercel deployment context. Current `main` at the start of this change was `203dfebc53deb83d1ecd487dd29092bc636a70c1`. GitHub reports the branch unprotected; no local checkout or local working-tree status is exposed here.
- Confirmed the canonical first-party route rule in `README.md`, `AGENTS.md` and §1.2. The only remaining actionable separate-subdomain proposal was the historical 301 bullet in `roadmap.md`. The referenced `.lovable/plan.md` path does not exist; `.lovable/plan/` is a directory whose current dated note concerns rate-cache behavior, not subdomain routing.
- Marked the old roadmap redirect proposal **SUPERSEDED — DO NOT EXECUTE**, preserving its original host-to-path mapping as historical context. Corrected §1.2 to point to the actual roadmap history and checked the matching Phase 1 documentation-cleanup item. This is not evidence that DNS redirects exist or that they do not exist; the actual production host and redirect state remain unverified.
- Static documentation assertions passed: the stale `.lovable/plan.md` reference was removed; the historical 301 proposal is explicitly superseded and no longer an unchecked active task; README and AGENTS continue to specify the canonical first-party hub. No application source, DNS, hosting configuration, production data or deployment was changed.
- No application tests, lint or build were run for this documentation-only correction. The current `main` head has no associated workflow runs or combined status checks. The latest recorded PR #1 CI remains failed overall: 29/29 tests and production build passed, but ESLint failed with 1,606 Prettier errors and 10 warnings. PR #3, #4 and #5 have no submitted reviews and no PR-triggered workflow runs. No PR was merged.
- Phase 0 remains open: production host/runtime-variable evidence, access to the correct SkyCo Lovable workspace, deployed build configuration/package-manager evidence, and PR #1's safe reconciliation/lint resolution/review remain outstanding. Vercel's accessible team still lists no SkyCo-linked project; this does not establish the live host.
- **Next eligible task to evaluate:** add a clear pre-share disclosure and explicit confirmation before Float creates or shares a URL. Current `src/components/float/FloatPlanner.tsx` immediately encodes the income, bills and BNPL entries into the `?d=` query and opens the Web Share API or copies the link; `src/lib/float-share.ts` uses URL-safe Base64, not encryption. PR #3's current scope covers policy/security wording but does not implement this confirmation. Inspect existing Float tests and the complete share UI before changing behavior; keep the change on a short-lived branch with focused tests and a PR.


## 19. Website quality audit — 8 November 2026 — live experience and trust pages

- **Execution time:** 8 November 2026, 00:21 Australia/Brisbane.
- **Website:** SkyCo, https://skyco.online. **Repository / branch:** eboxont-code/skyco, main. The remote main head at the start of the audit was 8f295b3aab3c90f4c6000e6dec54890230c69bb8 (docs: supersede historical product subdomain redirects). The GitHub connector could read the private repository; no local checkout or local working-tree status was exposed.
- **Standard:** read the complete Universal Website Quality Standard — 500 Checks before this audit.
- **Environment and scope:** live production pages at /, /currensee, /chronos, /float, /privacy and /security; browser viewport checks at 390 × 844 and 768 × 1024. No PR preview URL or current successful PR check was exposed by the inspected PR/status data.
- **Score:** this run evaluated a 54-check sample, not the complete website. Earned 37 / 54 applicable checks (68.5%): PASS 31, PARTIAL 12, FAIL 5, UNVERIFIED 6, BLOCKED 0, N/A 0. The full 500-check score is NOT DETERMINED; 446 checks remain unreviewed and applicability still needs to be decided for them.
- **Checklist IDs — PASS:** 001, 004, 005, 019, 029, 041, 058, 059, 066, 081, 082, 087, 088, 101, 102, 104, 105, 106, 108, 117, 119, 169, 177, 181, 182, 184, 197, 201, 301, 381, 382.
- **Checklist IDs — PARTIAL:** 084, 095, 157, 161, 162, 166, 168, 172, 183, 187, 285, 323.
- **Checklist IDs — FAIL:** 121, 125, 332, 340, 394.
- **Checklist IDs — UNVERIFIED:** 144, 185, 188, 189, 261, 281.
- **Critical gates:** NOT DETERMINED. No share was generated or sent during this audit. A high privacy finding remains open in Float's share flow; severity is treated as high pending full source and preview verification, not as a confirmed critical data incident.
- **Findings:**
  - **High privacy / checks 332, 340, 394:** the live Privacy Policy says it covers CurrenSee, Chronos, My Finance Friend and Grocery Packs, says nothing a visitor types is collected and says the current product experiences do not retain entries after leaving. It omits Float. The live Float page says guest mode keeps the visitor's numbers in this browser and says the waitlist stores name, email and selected product. The live Security and Data Handling table also omits Float. These public disclosures do not match the live product descriptions. PR #3 remains an open draft; its branch contains revised Float, storage, provider and waitlist disclosures, but no current CI status or preview was available.
  - **High privacy / check 332:** the live Float UI offers “Share these numbers” and describes sharing figures as a link without showing a pre-share disclosure. The project record and open PR #6 describe the share payload as Base64 URL-safe data in the URL, not encryption, and list the included income, bills and BNPL details. The live share action was not clicked and no link was created. PR #6 remains an open draft; its source adds an explicit warning and confirmation, but current tests and runtime focus/keyboard behavior were not verified in this environment.
  - **Content / checks 121, 125, 183, 285:** the live Chronos page title says “one date in six calendars”; the page content and observed date readings show seven systems. The homepage Chronos screenshot alt text also says six systems. PR #4 is open and non-draft; PR #8 is open and draft. The live mismatch remains until verified changes reach production.
  - **Responsive and navigation evidence:** on sampled pages, no horizontal overflow was observed at 390 px; homepage and Float showed no overflow at 768 px. The mobile navigation opened, Escape closed it, and focus returned to the menu button. The homepage CurrenSee action navigated to /currensee; the reference rate and 30-day chart loaded after initial loading. Image alt attributes were present on inspected pages, though the Chronos alt text is inaccurate.
- **Repository and PR review:** main was the current default branch and the branch listing reported it unprotected. No open issues were returned; 10 PRs are open (#1 and #3–#11). PR #3 and #6 are drafts. No combined statuses were returned for queried PR heads #1, #3, #6, #11 and #4. The latest main commit inspected was documentation-only. No PR was merged and no deployment was performed.
- **Tests and verification:** manually inspected the live pages and the listed viewport behaviors; checked direct navigation and the live rate/chart load. No application tests, lint or build were run because this run had no local repository checkout or project toolchain. No application code was changed.
- **Changes:** this audit record only. No application behavior, hosting settings, DNS, production data or deployment changed. No Phase 1 checklist item is marked complete.
- **Remaining work / next priority:** resolve the live Float share disclosure and privacy-policy mismatch through PRs #6 and #3, then verify both branches with the project test/build workflow and a browser preview before requesting maintainer review. Fix and verify the stale Chronos title and homepage alt text through PRs #4 and #8. Keep the Phase 0 runtime-host, Lovable-sync and deployed-toolchain evidence open; this does not block these independent website tasks under the eligibility clarification in section 17.

## 20. Execution log — 7 November 2026 — privacy and security audit against current source

- Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md`; inspected the current `main` branch, repository tree, working-tree availability, open issues/PRs, recent Actions runs and available deployment evidence. Current `main` at the start of this audit was `8f295b3aab3c90f4c6000e6dec54890230c69bb8`. GitHub reports `main` unprotected with no required status checks; no local checkout or local working-tree status is exposed in this execution environment. No open issues were returned.
- PR #3 was based on `407e22d4e3101e7845168a623ccf65b79a692179`, 16 commits behind current `main`. The 16 intervening `main` commits changed `MASTER_PLAN.md`, `README.md`, the accepted website/Android ADR, `roadmap.md`, Frankfurter helper/tests and `rates.functions.ts`; none touched PR #3's three existing files. Preserved published history by adding current `main` as the second parent in merge commit [`cd300576c1c3c3928007d51682b52c990b4db5b3`](https://github.com/eboxont-code/skyco/commit/cd300576c1c3c3928007d51682b52c990b4db5b3) and fast-forwarding the PR branch. No rebase, force-push, amend or squash was used.
- Audited the five shipped products and support/waitlist paths against current implementation. Confirmed CurrenSee local storage includes the last pair/amount, recent pairs, favourites, default pair, up to 20 saved conversions, up to 10 alerts, a 5/15/30/60-minute alert interval and up to 30 alert-history entries. Alert checks run only while the page is open and visible; optional browser notifications require permission; each check sends only the selected currency pair to the rate function, not the amount or threshold. Corrected the inaccurate in-page statement that nothing is sent to a server.
- Confirmed Chronos synchronizes the selected date into the `?date=YYYY-MM-DD` URL as the visitor changes it; the comparison date and date-of-birth inputs remain in page memory. Corrected the Privacy and Security descriptions, which previously implied the selected date was only in page memory and only entered the URL when shared.
- Confirmed Grocery checked items are stored per pack in local storage and household size is stored separately. Confirmed Float guest data is written to local storage only after explicit guest-mode action; its share payload is URL-safe Base64 containing income, bill and BNPL entries with names, amounts, dates, recurrence, optional original amounts and deal-end dates. Base64 is not encryption. The Float waitlist sends product, optional name and email to the server function; the table supplies a generated ID and timestamp and the repository defines no automatic expiry.
- Confirmed the Support form stores only the message text in the current tab's session storage, removes that draft when the form is submitted to open the mail app, and creates a mail draft whose subject contains topic/product and whose body contains message, optional name and browser user-agent. No contact POST is made to a SkyCo server. Updated the visible form note and code comment to say this precisely.
- Updated PR #3 files: [Privacy disclosure](https://github.com/eboxont-code/skyco/commit/4e08e944cd69348c1f0a18b94be5039c7b101f60), [Security disclosure](https://github.com/eboxont-code/skyco/commit/3b714eb738120452e281654bcb4495488380182c), [Support email disclosure](https://github.com/eboxont-code/skyco/commit/47bc3cf8fba6f06ecf97e996d268b2821141f420) and [CurrenSee alert UI disclosure](https://github.com/eboxont-code/skyco/commit/7092823e714071ae4f1e9c2cf7fb0ffd6f418779). The provider table also distinguishes the 60-second per-pair cache from the separate freshness-aware Nepal Rastra Bank payload cache and notes the explicitly labelled INR/1.6 NPR fallback.
- Static source-to-copy assertions passed **21/21** across the updated Privacy/Security pages, Contact form, CurrenSee alerts, Chronos URL state, CurrenSee storage/link logic, Grocery storage, Float guest/share, waitlist server/schema/migration, Finance Friend parser and NRB cache. No application test, lint or build command was run: there is no local checkout or Bun executable here; `package.json` on `main` has no test script, and `main` has no general install/lint/test/build workflow. PR #3 has no PR-triggered workflow run, review submission or review thread. These source assertions do not substitute for the project toolchain or browser verification.
- PR #3 remains a draft and no Phase 1 privacy/security checklist item is marked complete. The checklist remains open pending project-toolchain checks, browser/manual verification and review. No production behaviour or data flow was changed; only privacy/help copy and a misleading alert disclosure were corrected. No production settings, secrets, DNS, data or deployment were changed.
- Current Actions history still shows PR #1 run [42213036495](https://github.com/eboxont-code/skyco/actions/runs/42213036495) as failed overall: locked install passed, 29/29 tests across 8 files passed, production build passed, but ESLint failed on 1,606 Prettier errors and 10 warnings. The historical secret scan [42201818522](https://github.com/eboxont-code/skyco/actions/runs/42201818522) passed. The remaining recent runs are the two earlier failed PR #1 attempts. No PR #3 checks are present.
- Phase 0 remains open. Owner-only dependencies remain: identify the actual production host/project and provide read-only runtime-variable/build evidence; make the correct SkyCo Lovable project accessible for sync verification; and provide the deployed build configuration/logs needed to confirm the production package manager. PR #1 still needs non-destructive reconciliation, a verified lint resolution and maintainer review. Vercel's accessible Boxont team still lists no SkyCo-linked project; this does not establish that the live site is not hosted elsewhere. No hosting settings or environment values were read or changed.
- **Next eligible task to evaluate:** inspect PR #6's existing Float pre-share confirmation and focused tests against the current `FloatPlanner`/share payload, especially cancellation-before-URL-generation, accessible confirmation controls and the exact disclosed fields. PR #6 is already open, so avoid duplicating its implementation; add only any independently verifiable missing coverage or correction. Do not merge or deploy.

## 21. Execution log — 8 November 2026 — revalidate and reconcile PR #3 privacy/security disclosures

- Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md`; inspected current `main`, the PR #3 branch, open pull requests/issues, recent CI evidence and available deployment context. Current `main` is `39bb2084778c3db68a6f4864fedea2b3bab4ebe7`; PR #3 started at `6f5533b6f220fe007d31598fd2546a39e68aa72f`. No local checkout or local working-tree status is exposed in this execution environment.
- PR #3 was 12 commits ahead and 1 behind `main`. The sole intervening `main` commit, [`39bb208`](https://github.com/eboxont-code/skyco/commit/39bb2084778c3db68a6f4864fedea2b3bab4ebe7), changes only `MASTER_PLAN.md` by adding the 8 November website-quality audit; no application source files changed on `main` since the PR branch's base. The branch's existing privacy/security, Support and CurrenSee-alert changes were retained.
- Rechecked the five shipped product disclosures against the current `main` implementation and PR #3's copy. Static source-to-disclosure assertions passed **21/21** across product coverage, CurrenSee storage and alert requests, Chronos URL state, Grocery persistence, Float guest/share/waitlist behavior, Finance Friend page memory, Support mailto handling and rate-provider/cache/fallback wording. This is source-level verification, not a repository test, browser test or deployment check.
- Preserved both independent execution records in this plan: the existing PR #3 source audit is retained as section 20, and the latest live website-quality audit from `main` remains section 19. Reconciled the branch with current `main` using two-parent merge commit [`87c476b`](https://github.com/eboxont-code/skyco/commit/87c476b725a568798a528209914da665f39dcf0d) (PR branch first parent, current `main` second parent); no published history was rebased, amended, squashed or force-pushed.
- PR #3 remains open and draft, with no review submissions, inline review threads, PR-triggered workflow runs or combined status checks. No Phase 1 privacy/security checklist item is marked complete. Browser/manual verification and the project toolchain checks remain outstanding.
- Current `main` `package.json` still has no `test` script; it defines `lint: eslint .` and `build: vite build`. Main has only the historical secret-scan workflow. The latest PR #1 CI run [42213036495](https://github.com/eboxont-code/skyco/actions/runs/42213036495) still shows locked installation passed, 29/29 tests passed, production build passed, and ESLint failed. No local checkout or Bun executable is available here, so repository lint/tests/build were not run.
- Read-only Vercel context shows the accessible Boxont Hobby team links only `neighbourhood-guidebook`, `mtdgc` and `bearbreaker`; deployment searches for `skyco` and `skyco.online` return zero records. This does not identify the actual production host or prove that the site is not deployed elsewhere.
- Phase 0 remains open: actual production host/runtime-variable access, the correct SkyCo Lovable workspace, deployed build configuration/package-manager evidence, and PR #1's safe reconciliation, verified lint resolution and maintainer review remain unresolved. These do not freeze independent Phase 1 work, but this PR still requires an accessible interactive preview and full project checks before it is ready for review.
- **Next candidate to evaluate:** browser verification of the Privacy/Security pages and Float share-confirmation flow across mobile/desktop, keyboard focus and screen-reader behavior. **Blocked for now:** no matching interactive PR preview/browser is exposed, and no Bun-enabled repository checkout is available for full project checks. Reassess when a preview URL/browser and reproducible project toolchain become available; do not merge or deploy.


## 22. Execution log — 8 November 2026 — privacy/security disclosure regression coverage

- Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md`; inspected current `main` (`39bb2084778c3db68a6f4864fedea2b3bab4ebe7`), the PR #3 branch, open PRs/issues, current PR #1 CI evidence and available Vercel deployment context. GitHub exposes no local checkout or working-tree status. No open GitHub issues were returned.
- The earliest Phase 0 candidates were reclassified against their direct prerequisites: production runtime-variable verification is blocked by the unidentified production host and missing read-only environment access; Lovable sync is blocked because the correct SkyCo workspace is not accessible; deployed package-manager confirmation is blocked by missing production build configuration/logs. PR #1's reproducible test/CI work remains open: its branch is 5 commits ahead and 24 behind current `main`, and its latest ESLint job still fails on 1,606 Prettier errors and 10 warnings. The existing lint gate was not weakened and no broad formatting was attempted.
- Phase 1 source-only candidates were checked against existing PRs to avoid duplication. Chronos copy/metadata is already represented by PR #4; planned-product/llms corrections by PR #5; Float share confirmation by PR #6; PWA copy/manifest by PR #9; and the 404 registry navigation by PR #10. Browser, keyboard and screen-reader verification of PRs #3/#6 remains blocked by the absence of an accessible interactive preview and a reproducible local Bun checkout.
- Added [`src/lib/privacy-security.test.ts`](https://github.com/eboxont-code/skyco/blob/docs/privacy-security-reconcile/src/lib/privacy-security.test.ts) to [PR #3](https://github.com/eboxont-code/skyco/pull/3) in commit [`95d0664`](https://github.com/eboxont-code/skyco/commit/95d06640e4029b4d2cac561d967a442f80076463). The 10 `node:test` cases read the live product registry and relevant implementation sources, then guard privacy-policy coverage for all five shipped products, security-table row coverage, CurrenSee/Grocery persistence, Float guest storage and every serialized share field, Float waitlist schema/Supabase insertion and retention wording, Support session-storage/mailto handling, Chronos URL state, Finance Friend page-memory wording, provider/hosting disclosures and the removal of stale blanket no-storage claims.
- Direct source assertions were executed against the fetched PR branch and current implementation sources: **10/10 passed**. The evidence was recorded in [`23d53ec`](https://github.com/eboxont-code/skyco/commit/23d53ec59609ca9aafd494deacc7ebab3621ad3e), with the time-sensitive ahead-count wording removed in [`d3e3154`](https://github.com/eboxont-code/skyco/commit/d3e3154b2cd9e7020182617fd3b3e0a062fbb5c7). This is source-level verification only; the new test file was not executed by Node/Bun's test runner because this environment has no local checkout and Bun is unavailable. The file follows the repository's existing `node:test` convention and will be included by the proposed `bun test` command when PR #1's runner is integrated.
- PR #3 remains open and draft; GitHub reports it mergeable. It has no review submissions, inline review threads or PR-triggered workflow runs. No privacy/security checklist item is marked complete; browser/manual verification, full project tests/lint/build and review remain outstanding.
- Current main still has no general install/lint/test/build workflow or `test` script. The latest PR #1 run [42213036495](https://github.com/eboxont-code/skyco/actions/runs/42213036495) passed locked installation, 29/29 tests and the production build, but failed ESLint with the existing formatting baseline. The historical Gitleaks scan [42201818522](https://github.com/eboxont-code/skyco/actions/runs/42201818522) remains successful.
- Read-only Vercel context still exposes only the Boxont Hobby team's `neighbourhood-guidebook`, `mtdgc` and `bearbreaker` Git-linked projects; no SkyCo project or deployment evidence was found. This does not identify the actual production host. No hosting configuration, secrets, DNS, production data or deployment was changed.
- Phase 0 remains open: production host/runtime access, the correct SkyCo Lovable workspace, deployed build configuration/package-manager evidence, and PR #1's non-destructive reconciliation, verified lint resolution and maintainer review remain unresolved.
- **Next candidate to evaluate:** complete a source-only SEO consistency audit of `public/robots.txt`, `public/sitemap.xml`, route canonical/structured-data helpers and `/llms.txt`, while checking PRs #4, #5, #8 and #9 for overlapping work first. This audit can be performed without production-host or Lovable access; live crawler/runtime verification remains separate and blocked until a matching preview or confirmed production host is available.


## 23. Execution log — 8 November 2026 — execute privacy/security disclosure regression suite

- Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md`; rechecked current `main` (`39bb2084778c3db68a6f4864fedea2b3bab4ebe7`), PR #3's exact branch sources, all open PRs/issues and recent Actions runs. PR #3 was open/draft at head `465a9ebc9cae13edc952fc93fe233bc2ace0b9b9`; no reviews or inline review threads were present. No local checkout or local working-tree status is exposed in this execution environment. No open non-PR issues were returned.
- Phase 0's first unchecked candidates remain individually blocked: production runtime-variable verification needs the actual host/project identity and read-only environment access; Lovable sync verification needs the correct SkyCo workspace; production package-manager confirmation needs deployment build configuration/logs. The PR #1 test/CI integration remains open and is not on `main`; its latest run [42420376203](https://github.com/eboxont-code/skyco/actions/runs/42420376203) passed frozen installs, 33/33 tests and production build but failed ESLint on 1,606 Prettier errors and 10 warnings. No lint rule was weakened or mass-formatting attempted.
- The independent Phase 1 privacy/security test task was eligible because the suite reads only repository source and built-in Node APIs; it does not require production-host, Lovable or browser-preview evidence. PR #3's existing `src/lib/privacy-security.test.ts` and all referenced sources were inspected at the exact branch head before execution.
- To execute the suite with the repository's intended toolchain without merging PR #1's unrelated CI work, added a temporary push-triggered workflow on PR #3's existing branch, pinned to the same immutable checkout/setup-Bun action revisions used by PR #1 and Bun 1.4.4. GitHub Actions run [42422904328](https://github.com/eboxont-code/skyco/actions/runs/42422904328) checked out branch commit `5d85f789fde9a5780fa3f5c6429de240c8531965` and executed `bun test src/lib/privacy-security.test.ts` against that exact source tree. Result: **10 passed, 0 failed**, across one test file. The logs show all ten named cases passed.
- The temporary workflow `.github/workflows/verify-privacy-security.yml` was removed immediately after the successful run in commit [`21dea2a`](https://github.com/eboxont-code/skyco/commit/21dea2a04694797175ebff750110019c7818c5a1). The final PR tree contains no temporary workflow. The temporary workflow's add/remove commits remain in branch history; no published commit was rewritten.
- This was a focused test run only. It did not run the full repository test suite, ESLint, typecheck or production build. It does not replace interactive Privacy/Security page verification, Float share-dialog keyboard/focus/screen-reader checks, or maintainer review. No Phase 1 privacy/security checklist item or Phase 0 gate is marked complete.
- PR #3 remains open and draft; no merge, production deployment, DNS/hosting/environment change, secret access or production-data change occurred. Current `main` is unchanged. No local working-tree cleanliness claim is made.
- **Next eligible task:** continue the independent Phase 1 source-only SEO consistency audit already queued in section 22: verify `public/robots.txt`, `public/sitemap.xml`, route canonical/structured-data helpers and generated `/llms.txt` against the five live products and two planned products. Inspect PRs #4, #5, #8 and #9 for overlap first. Live crawler/runtime verification remains separate until a matching preview or confirmed production host is available.

## 24. Execution log — 8 November 2026 — post-merge privacy and Float share recheck

- **Execution time:** 8 November 2026, 00:15 UTC / 10:15 Australia/Brisbane. **Project:** SkyCo, https://skyco.online. **Repository/branch:** `eboxont-code/skyco`, `main`; latest observed main commit is [`9f6dbf3`](https://github.com/eboxont-code/skyco/commit/9f6dbf3694620cc1885841247abf989365863cb2), which merged PR #3 at 00:13 UTC. The repository is private but readable through the connected GitHub account. The active local workspace is not a Git checkout; `git status` returned “not a git repository,” so no local branch or working-tree cleanliness is claimed.
- Re-read the complete Universal Website Quality Standard — 500 Checks before this audit and reviewed current `AGENTS.md`, `README.md`, `MASTER_PLAN.md`, `roadmap.md`, recent commits, branches, pull requests and issues. GitHub returned 13 branches, 10 open PRs (#1, #4–#12), and no open issues.
- **Source findings:** current `main` privacy and security pages now cover all five shipped products and accurately describe Float guest data in browser storage after the visitor opts in, the URL-safe Base64 share payload (not encryption), and the Float waitlist fields sent to Supabase. The current `main` Float share handler still constructs the URL immediately when clicked and has no confirmation dialog. PR #6 already contains a confirmation dialog and payload disclosure, but remains open/draft at head `1d7d706`; its diagnostics returned no checks, statuses or workflow runs. The #3 merge commit also has no combined statuses or pull-request workflow runs.
- **Live-site evidence:** the available crawler snapshot for `/privacy` and `/security` is dated two days before this execution and still shows the old August 2026 copy that omits Float. Today’s snapshots for `/float` and `/chronos` show the Float share entry point and the stale “six calendars” page title while the content describes seven. The computer-use browser provider was unavailable and no matching preview URL was exposed; therefore the Privacy/Security snapshots do not confirm whether PR #3 has deployed, and the live share-dialog interaction remains unverified.
- **Quality score:** no new numeric score was calculated this execution. The latest scored sample remains the historical 37/54 (68.5%) in section 19; it is not a current full-site score. The 500-check total remains undetermined. No checklist item is marked complete here. Checks 332, 340 and 394 still need production-render verification; check 332 also remains open until the pre-share disclosure/confirmation is implemented and verified. Chronos copy check 121 remains open pending the PR changes reaching a verified runtime.
- **Verification:** rechecked the merged source and current Float share implementation, GitHub combined statuses and PR #6 diagnostics. The PR #3 focused test run recorded in section 23 was 10/10 on its branch commit; it was not rerun against this merged main commit. No current-main tests, lint, build, responsive audit or keyboard/screen-reader interaction test ran in this execution. No application code, deployment, DNS, hosting setting, production data or secret was changed.
- **Next priority:** verify PR #6’s warning, Cancel/Continue behavior, focus return and narrow-screen accessibility in a matching browser preview; reconcile it with the merged #3 source and run the project’s focused tests and full checks when the checkout/toolchain is available. Keep PR #4/#8’s Chronos corrections and PR #1’s test/lint baseline open.


## 25. Execution log — 8 November 2026 — close superseded Chronos screenshot-copy PR

- **Execution time:** 8 November 2026, 17:44 Australia/Brisbane. **Repository:** `eboxont-code/skyco`; current `main` at task selection: [`18809a3fae6002d53372aae8117066ce52379a04`](https://github.com/eboxont-code/skyco/commit/18809a3fae6002d53372aae8117066ce52379a04). Re-read `README.md`, `AGENTS.md`, this complete plan and `roadmap.md`; inspected current `main`, open PRs/issues, recent Actions runs, PR #8's full patch/reviews/threads/statuses, the relevant screenshot metadata/assets and available deployment evidence. GitHub reports `main` unprotected. No open non-PR issues were returned. The GitHub integration exposes no local checkout or local working-tree status, so no local clean/dirty claim is made.
- **Task selection:** Phase 0 remains open. Runtime-variable verification is blocked by the unidentified production host and missing read-only hosting settings access; Lovable sync is blocked because the correct SkyCo workspace is not accessible; production package-manager confirmation is blocked by missing deployed build configuration/logs. PR #1's general CI proposal remains open and its recorded lint baseline fails on 1,606 Prettier errors and 10 warnings; no lint rule was weakened or broad formatting attempted. These gates do not freeze independent Phase 1 work. The Phase 1 Chronos screenshot-copy task in PR #8 was already completed more fully on current `main`, so no duplicate application change was eligible.
- **Evidence that PR #8 was superseded:** PR #8 targeted `main` from `fix/chronos-screenshot-alt`, head [`20833a331540d4473302ebb64b72d55fc71b7467`](https://github.com/eboxont-code/skyco/commit/20833a331540d4473302ebb64b72d55fc71b7467), with 3 commits ahead and 26 behind current main. Its two-file patch only changed the Chronos homepage screenshot alt/caption to count-neutral wording and appended its historical plan note; it did not refresh the screenshot. Current main already contains [`c42cf389e7f65678bbf79969a4d47c66c220fc9d`](https://github.com/eboxont-code/skyco/commit/c42cf389e7f65678bbf79969a4d47c66c220fc9d), which corrects the registry and page copy to seven calendars, updates the screenshot alt/caption and capture date to 8 November 2026, and refreshes the screenshot assets. The current `src/assets/shots/chronos.webp` blob is `1f525b797089e6c5cfaaabd35e2b0f4ac975a252`, compared with `730e063ff17f1ca0362f42ccd97539f5683117cb` at PR #8's base; both responsive image variants also have different blobs. Current `src/lib/product-shots.ts` says seven calendar systems and records the new capture date. The corresponding Phase 1 product-copy checklist entries are already checked on main with the source and viewport evidence recorded in §3.
- PR #8 had no submitted reviews, no inline review threads, no workflow runs and no combined status checks. GitHub reported it not mergeable and the branch was 26 commits behind. Added a PR conversation comment explaining the superseding main commit and the separate live-verification limitation, then closed [PR #8](https://github.com/eboxont-code/skyco/pull/8) unmerged. Its published commits were not rewritten; no PR code was merged.
- **Verification:** re-fetched the current main screenshot registry, Chronos route and product registry; compared the screenshot asset blob IDs at PR base versus current main; inspected the exact PR patch and confirmed it contains no asset refresh. This verifies the duplicate is superseded in source. No repository test, lint or build was run because this environment has no local checkout/Bun execution. No browser preview or fresh production screenshot was available in this run.
- **Deployment/release:** no merge or deployment was attempted. The merge-to-production trigger and actual production host remain unverified; no deployment URL/ID or deployed SHA is established. No live smoke test was performed. No application source, image asset, DNS, hosting settings, secrets, environment variables or production data were changed. Additional spend: $0.
- **Next eligible task to evaluate:** inspect PR #4 against current `main` before making any Chronos changes. Main already contains the seven-system registry/title and the refreshed screenshot, so determine whether any remaining PR #4 changes are genuinely missing or whether that branch is also superseded. Continue with the next independent Phase 1 item only after checking its exact source and acceptance criteria; keep all Phase 0 and live-browser gates open.


## 26. Execution log — 9 November 2026 — confirm canonical package manager from the main deployment build

- **Execution time:** 9 November 2026, 05:29 Australia/Brisbane. Re-read `README.md`, `AGENTS.md`, this complete `MASTER_PLAN.md` and `roadmap.md`; inspected current `main`, the open PR inventory, open issues, recent CI evidence, the relevant Phase 0 checklist, and read-only Vercel deployment/build records. Starting `main` HEAD was [`64f6d3645c623d743ac90588581b97bf652af3db`](https://github.com/eboxont-code/skyco/commit/64f6d3645c623d743ac90588581b97bf652af3db). GitHub reports `main` unprotected with no required status checks; no open non-PR issues were returned. The GitHub connector exposes no local checkout or working-tree status, so no local cleanliness claim is made.
- **Phase 0 eligibility:** the first unchecked runtime-variable item remains blocked: the Vercel project can be inspected, but its project metadata reports `live=false`, its environment-variable listing is empty, and the available evidence does not prove that this project is the host currently serving the public custom domain. It still needs owner-confirmed production-host identity and read-only runtime configuration evidence. Lovable sync remains blocked because the matching SkyCo workspace is not accessible. The package-manager item became eligible because the exact main deployment build log is now available.
- **Deployment evidence:** Vercel deployment [`dpl_9A3S1DNMhCaw7XbWJxAwQckjnhvh`](https://vercel.com/boxont/skyco/9A3S1DNMhCaw7XbWJxAwQckjnhvh) reports `READY`, target `production`, branch `main`, and commit `64f6d3645c623d743ac90588581b97bf652af3db`. The build log explicitly clones `main` at `64f6d36` and records `bun install v1.3.14`. This is direct evidence for the package-manager version used by that observed deployment; it does not establish the public-domain mapping, environment-variable completeness or Lovable sync.
- **Change:** updated the Development section in `README.md` to identify Bun 1.3.14 as canonical and link the exact deployment evidence. Updated §1.1 and checked the Phase 0 canonical-package-manager item in this plan. These are narrowly scoped documentation-only changes committed directly to `main` under the direct documentation exception in `AGENTS.md`; no application source, dependencies, lockfile, workflow or product behavior changed.
- **Verification:** re-read both updated files and checked that README and the checklist state Bun 1.3.14, the plan links the matching READY deployment and main SHA, and the deployment log contains the exact `bun install v1.3.14` line. No application tests, lint or build were run because this change is documentation-only and no local checkout is exposed.
- **Other gates:** PR #1 remains open; its Bun 1.3.14 alignment is consistent with this evidence, but its test/CI workflow is not on `main` and the recorded lint baseline still fails on 1,606 formatting errors and 10 warnings. No lint rule was weakened and no mass-formatting was performed. PR #4 is closed unmerged and its seven-calendar correction is already present on `main`. The Phase 0 runtime-variable, Lovable-sync, reproducible test/CI and lint-baseline items remain open.
- **Next eligible task:** reconcile the existing current-main Float share-confirmation regression-test branch [PR #14](https://github.com/eboxont-code/skyco/pull/14) with current `main` using a non-rewriting two-parent merge commit, then verify its exact test source and current-head test evidence. Its five focused tests have prior successful Bun 1.4.4 runs; the main-side change since its base is documentation-only. Keep keyboard/focus-return, screen-reader/TalkBack, native-share cancellation and narrow-viewport acceptance open until an accessible interactive preview is available. Do not merge or deploy.
- **Impact/release:** documentation only; no PR was merged, no deployment was triggered, and no production settings, DNS, secrets, credentials, environment variables, production data or hosting configuration changed. Additional spend: **$0**.

## 27. Historical execution log — 8 November 2026 — sitemap and robots registry regression coverage

- **Execution time:** 8 November 2026, 05:34 Australia/Brisbane.
- **Repository baseline:** private `eboxont-code/skyco`, default branch `main`, current main HEAD `39bb2084778c3db68a6f4864fedea2b3bab4ebe7`. Re-read `README.md`, `AGENTS.md`, this plan and `roadmap.md`; inspected the current main tree, package scripts, sitemap, robots file, product/pair/Float registries, SEO helpers, relevant route metadata, open PRs, issues and available Actions evidence. No local checkout is exposed, so no local working-tree status is claimed.
- **Repository/PR state:** no open issues. The pre-change inventory had 10 open PRs (#1 and #3–#11); this run added PR #12, so 11 are now open (#1 and #3–#12). PR #1 is open/non-draft and currently reported unmergeable; its latest recorded workflow run [42213036495](https://github.com/eboxont-code/skyco/actions/runs/42213036495) passed frozen installs, 29/29 tests and the production build but failed ESLint on 1,606 existing Prettier errors and 10 warnings. Main has no associated workflow runs or combined status checks; its only workflow is the historical secret scan. PRs #4 and #8–#11 retain the older recorded base SHA `8f295b3` and are currently reported unmergeable; PR #7 also has that older base but GitHub reports it mergeable. PRs #3, #5, #6 and #12 are based on `39bb208` and are reported mergeable. No PR was merged.
- **Phase 1 task selection:** inspected the remaining SEO checklist item and existing PR scopes before editing. PR #4 covers Chronos seven-calendar metadata, PR #5 covers planned-product and `llms.txt` behavior, PR #7 covers Status-page copy/metadata, PR #8 covers Chronos screenshot copy, PR #9 covers PWA wording/manifest, and PR #10 covers 404 navigation. None changes `public/sitemap.xml` or adds sitemap/robots regression coverage. The source-only sitemap test is independent of the unresolved production host, Lovable workspace and deployed package-manager evidence.
- **Sitemap audit against current main:** 59 URL entries, all unique and on `https://skyco.online`; all five shipped product paths are present; Budget & Expenses and Daily Notes are absent; all 34 CurrenSee pair URLs exactly match `PAIRS`; all 8 Float landing URLs exactly match `FLOAT_PAGES`; the NPR rates page and two guide pages are included; the legacy `/finance` redirect is excluded. Every URL entry has one valid ISO `lastmod` date. `public/robots.txt` points to the canonical `https://skyco.online/sitemap.xml`. No sitemap defect was found, so the XML and robots files were not changed.
- **Change:** added `src/lib/sitemap.test.ts` with six Node/Bun-compatible regression tests for unique canonical first-party URLs, shipped-versus-planned product inclusion, exact CurrenSee pair coverage, exact Float landing-page coverage, one valid `lastmod` per URL, and the robots sitemap directive. The tests import the actual project, pair and Float registries; no new dependency or application behavior was added.
- **Verification:** direct source-to-sitemap assertions against fetched current-main source confirmed 5 shipped products, 2 planned products, 34 pair pages and 8 Float pages match the 59-entry sitemap with no duplicates or extra/missing dynamic paths. Node v22.16.0 ran the exact new test assertions in an isolated temporary fixture: **6 passed, 0 failed**. The temporary Node copy used explicit `.ts` import extensions because Node 22 does not resolve the repository's extensionless TypeScript imports; the committed imports retain the existing repository convention used by Bun. This was not a full repository checkout or Bun/package-script run. Bun, repository lint and production build were not run; `package.json` on main has no test script, and the proposed Bun runner remains on PR #1.
- **Branch/PR:** short-lived branch `test/sitemap-registry-coverage` was created from the recorded main HEAD. Commits: [8e8ba50](https://github.com/eboxont-code/skyco/commit/8e8ba50c85b72b097879d8700f6bc55aa12174d6) (add sitemap regression tests), [223d3f1](https://github.com/eboxont-code/skyco/commit/223d3f15a14847617cdf9fcdbb6222dfb954cdb9) (validate each URL's last-modified field), [94bf5a0](https://github.com/eboxont-code/skyco/commit/94bf5a014473cf940f26f75c4786f9c6df55988c) (record audit evidence), and [f3fa5bc](https://github.com/eboxont-code/skyco/commit/f3fa5bc9fc0861a9df3daa7deb2ea476a2c80bdc) (link PR and correct the current PR inventory). Open draft [PR #12](https://github.com/eboxont-code/skyco/pull/12) contains 4 commits, is 4 ahead / 0 behind `main`, and GitHub reports it mergeable. It has no workflow run or combined status check. It is not merged.
- **Remaining acceptance/blockers:** this covers sitemap/robots consistency only; the Phase 1 SEO checklist remains unchecked until titles, canonical/OG/Twitter metadata, structured data and generated `llms.txt` are checked together and browser/crawler behavior is verified. Existing Chronos and Status metadata corrections remain on their open PRs. Browser/mobile verification still needs an accessible preview. Phase 0 remains open: production host/runtime settings, correct Lovable project access, deployed build configuration/package-manager evidence, and safe resolution/review of PR #1's lint/CI baseline are not available here.
- **Next eligible task to evaluate:** add focused source-backed assertions for canonical, Open Graph, Twitter and structured-data URLs across the five shipped product routes, first checking PR #4 and other existing metadata corrections for overlap. Keep browser/crawler verification separate until a matching preview or confirmed production read-only access is available.
- **Impact/rollback:** test and plan documentation only. No sitemap, route, provider, product data, hosting, DNS, environment variable, production data or deployment changed. If the test is rejected, revert its commits with new commits; do not rewrite published history.



## 28. Historical execution log — product route SEO URL regression coverage — 8 November 2026

- **Repository baseline:** re-read `README.md`, `AGENTS.md`, this plan and `roadmap.md`; inspected current `main` at `39bb2084778c3db68a6f4864fedea2b3bab4ebe7`, its recursive tree, the five shipped product route files, `src/lib/seo.ts`, the product registry, package scripts, open issues/PRs and recent Actions history. No local checkout or local working-tree status is exposed in this execution environment. GitHub returned no open issues and 11 open PRs (#1 and #3–#12). The combined status for current `main` is empty. The branch-protection endpoint returned 403 for this GitHub integration, so no new branch-protection claim is made.
- **Task selection:** Phase 1's SEO checklist remains open. Inspected PR #4's Chronos metadata tests and the existing scopes of PRs #3–#12. PR #4 covers Chronos seven-calendar wording/metadata, PR #5 covers planned-product wording and `llms.txt`, PR #7 covers Status-page metadata, PR #8 covers Chronos screenshot copy, PR #9 covers PWA copy/manifest, PR #10 covers 404 links, and PR #12 already covers sitemap/robots. None tests canonical, Open Graph, Twitter and structured-data URL consistency across all five shipped product routes. Extended the existing focused SEO regression branch/PR #12 rather than opening a duplicate PR.
- **Source audit:** inspected `src/routes/currensee.tsx`, `chronos.tsx`, `finance-friend.tsx`, `grocery.tsx` and `float.tsx`, plus `src/lib/seo.ts` and `src/lib/projects.ts`. All five routes currently declare the canonical `https://skyco.online/<product>` URL, use the same constant for `og:url` and the canonical link, supply matching Twitter title/description/image tags, call `productAppScript` with the same first-party path, and pass the same path to the breadcrumb helper. Float uses a shared `IMAGE` constant; the other four declare their image URL inline. No URL mismatch was found, so no route/helper behavior was changed.
- **Change:** added `src/lib/product-seo.test.ts` with eight Node/Bun-compatible tests: one ensures the five test route definitions match the shipped registry exactly; five check each route's canonical, Open Graph, Twitter, image-alt, SoftwareApplication-helper and breadcrumb wiring; one checks the generated SoftwareApplication JSON-LD URLs and publisher URL; one checks generated BreadcrumbList item URLs. The test exercises the shared helpers and reads route source so a future route can not silently drift from its canonical URL.
- **Verification:** Node v22.16.0 ran the exact test assertions in an isolated temporary fixture populated with the fetched helper logic and the route metadata blocks: **8 passed, 0 failed**. Node emitted its expected experimental type-stripping warning. Separately, direct assertions against the complete fetched current-main route files passed **12/12 checks on each of the five routes (60/60)**; the five route/path pairs also matched the actual registry. This is not a full repository checkout or Bun/package-script run. Bun is unavailable, no local checkout is exposed, and current `main` still has no `test` script; repository lint and production build were not run.
- **Branch/PR:** extended short-lived branch `test/sitemap-registry-coverage` and existing draft [PR #12](https://github.com/eboxont-code/skyco/pull/12), now titled “Protect sitemap and product SEO URL invariants”. Test commit: [`6007571`](https://github.com/eboxont-code/skyco/commit/6007571c607c357c6453763cb5682df70a33d590). Before this final plan-evidence commit, the branch compares as 8 commits ahead and 0 behind current `main`; this update is the ninth commit. PR #12 remains open, draft and mergeable, with no reviews, review threads, workflow runs or combined status checks. No PR merge, review request or deployment was performed.
- **Remaining acceptance/blockers:** the Phase 1 SEO item remains unchecked. This test covers five product-route URL wiring and the shared structured-data helpers, not the full titles/copy review, `llms.txt`, dynamic CurrenSee/Float pages, deployed HTTP output, crawler rendering or live search indexing. PR #4's Chronos correction remains open and unmerged; its branch is based on an older main head and GitHub currently reports it unmergeable. Browser/crawler verification needs an accessible preview or confirmed production host. Phase 0 still lacks production host/runtime-variable evidence, correct Lovable workspace access and deployed build configuration/package-manager evidence; PR #1's latest CI still has the recorded lint failure.
- **Next eligible task:** reconcile PR #4 with current `main` using a non-rewriting two-parent merge commit, then verify its existing Chronos copy/metadata tests and updated ahead/behind state. Do not merge it; maintainer review and the required project checks remain outstanding.
- **Impact/rollback:** test and plan documentation only. No product behavior, route, metadata helper, sitemap, provider, data, hosting setting, DNS, environment variable, production data or deployment changed. Revert with new commits if rejected; do not rewrite published history.

## 29. Execution log — run sitemap and product SEO regression tests with Bun — 8 November 2026

- **Execution time:** 8 November 2026, 01:41 UTC / 11:41 Australia/Brisbane. **Repository:** private `eboxont-code/skyco`. Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md`; inspected current `main`, the full PR #12 diff, the two test files and their actual helper/registry/route dependencies, open PRs/issues, current Actions history and available deployment evidence. Current `main` is [`18809a3fae6002d53372aae8117066ce52379a04`](https://github.com/eboxont-code/skyco/commit/18809a3fae6002d53372aae8117066ce52379a04). No local checkout or local working-tree status is exposed; no local cleanliness claim is made.
- **Task eligibility:** Phase 0 production host/runtime-variable evidence remains blocked by the unidentified production project and missing read-only settings access; Lovable workspace sync still lacks direct workspace access; deployed package-manager confirmation still needs actual build configuration/logs. PR #1's CI baseline remains open with 1,606 existing Prettier errors and 10 warnings. The interactive/crawler portion of Phase 1 SEO acceptance is blocked by the lack of a matching preview or verified production host. The focused source-level SEO regression suite is independent of those blockers and was eligible to execute.
- **PR #12 source and branch review:** the PR contains six sitemap/robots tests and eight product-route SEO tests. The tests import the actual project/pair/Float registries and shared SEO helpers, read the sitemap/robots files and all five route sources, and assert first-party canonical/social/structured-data URL consistency. PR #4/#5/#7/#8/#9/#10 were checked for overlapping implementation; none duplicates these two test files. PR #12 had no submitted reviews or inline review threads and no prior workflow run. Its branch was 9 commits ahead and 25 behind the newly advanced main.
- **Non-rewriting reconciliation:** updated the published PR branch using two-parent merge commit [`10d51969c67a1a6ced7ec741ab3a469d2f2a0079`](https://github.com/eboxont-code/skyco/commit/10d51969c67a1a6ced7ec741ab3a469d2f2a0079). Parent 1 is the previous PR head `cddab9433ec17c0cf0bb03b946c739b710900150`; parent 2 is current main `18809a3fae6002d53372aae8117066ce52379a04`. The resulting tree is based on current main and retains both SEO test files plus the historical audit records from the PR branch. No rebase, amend, squash, force-push or history rewrite occurred.
- **Bun execution:** temporarily added a push-triggered, test-only workflow using the same immutable checkout/setup-Bun action revisions already used in PR #1. It installed Bun 1.4.4 and ran `bun test src/lib/sitemap.test.ts src/lib/product-seo.test.ts` against exact branch commit [`0d56672d9f3dce23df8983abade9b565e52e4a10`](https://github.com/eboxont-code/skyco/commit/0d56672d9f3dce23df8983abade9b565e52e4a10). [Actions run 42435288822](https://github.com/eboxont-code/skyco/actions/runs/42435288822) completed successfully: **14 passed, 0 failed across 2 files** (8 product-route SEO tests and 6 sitemap/robots tests). The logs confirm Bun 1.4.4. The tests required no project dependency installation; the workflow checked out the exact branch commit and ran the focused test command directly.
- **Temporary workflow cleanup:** removed `.github/workflows/verify-seo-regressions.yml` immediately after the successful run in commit [`938a00cf55115b31c2d5c810d9a5bbb1c4863d00`](https://github.com/eboxont-code/skyco/commit/938a00cf55115b31c2d5c810d9a5bbb1c4863d00). The final PR tree does not contain the temporary workflow. Its add/remove commits remain in branch history; no published history was rewritten.
- **Scope of evidence:** this is a successful focused test run on the reconciled PR branch, not the full repository suite. Full lint, typecheck and production build were not run. Browser-rendered metadata, crawler output, deployed HTTP responses and search indexing remain unverified. The Phase 1 SEO checklist is therefore still unchecked.
- **Current-main change observed:** the latest main commit [`18809a3`](https://github.com/eboxont-code/skyco/commit/18809a3fae6002d53372aae8117066ce52379a04), authored by the Lovable bot, adds a Radix Float share-confirmation dialog and two Float share-payload tests. This is new evidence of a main-branch Lovable-originated update, but it does not establish direct workspace sync access or production deployment. Main's exact commit has zero GitHub check runs and an empty combined status. The current main dialog uses an uncontrolled Radix `AlertDialog` and calls `share()` from Continue; the still-open PR #6 AST test expects a controlled dialog and `confirmShare`, so PR #6 must not be merged as-is without reconciling its tests to the actual main implementation. Browser keyboard/focus/screen-reader acceptance remains separate.
- **PR state:** PR [#12](https://github.com/eboxont-code/skyco/pull/12) remains open and draft. After reconciliation, its branch is 12 commits ahead and 0 behind current `main`; no merge was attempted. The project-specific Phase 0 release gate remains open, and the production host/deployment trigger is not established. Do not merge in a way that could unexpectedly publish.
- **Deployment and cost:** no production deployment or preview deployment was initiated; no deployment URL/ID or deployed SHA was produced. No DNS, hosting settings, environment variables, credentials, production data or application behavior were changed. Additional spend: **$0**.
- **Next eligible task:** add/execute a focused structural regression test for the Float share-confirmation dialog as it now exists on current `main` (uncontrolled Radix dialog, trigger, side-effect-free Cancel and Continue-only `share()`), rather than copying PR #6's now-mismatched controlled-state assertion. Keep interactive keyboard/focus/screen-reader and narrow-viewport verification blocked until a matching browser preview is available. Keep Phase 0 host, Lovable-workspace, deployed-toolchain and lint-baseline gates open.


## 30. Execution log — 8 November 2026 — final PR #12 SEO regression verification

- **Execution time:** 8 November 2026, 13:31 Australia/Brisbane. Re-read `README.md`, `AGENTS.md`, this master plan and `roadmap.md`; inspected the current `main` branch, PR #12's full diff and exact test/source dependencies, all open PRs, open issues, recent Actions runs and available deployment context. Current `main` remains [`18809a3fae6002d53372aae8117066ce52379a04`](https://github.com/eboxont-code/skyco/commit/18809a3fae6002d53372aae8117066ce52379a04). GitHub reports no open non-PR issues and 12 open PRs (#1 and #4–#14). The main branch API reports `protected=false` with no required status checks; the exact main commit has no workflow runs or combined statuses. No local checkout or local working-tree status is exposed.
- **Phase eligibility:** Phase 0 runtime-variable verification remains blocked by the unidentified production host and missing read-only environment access; Lovable sync remains blocked by the inaccessible matching workspace; deployed package-manager confirmation remains blocked by missing production build configuration/logs. PR #1's general CI remains unaccepted: its latest run [42420376203](https://github.com/eboxont-code/skyco/actions/runs/42420376203) passed 33/33 tests and the production build but failed ESLint with 1,606 Prettier errors and 10 warnings. These do not block the independent Phase 1 source-level SEO regression verification. Browser/crawler and deployed HTTP acceptance still need an accessible preview or confirmed production host.
- **PR #12 source review:** the branch contains six sitemap/robots tests and eight product-route SEO tests. They read the actual sitemap, robots file, five route sources, shipped product registry, CurrenSee pair registry, Float landing-page registry and shared SEO helpers. The tests and source dependencies were inspected at the PR branch. PR #12 has no submitted reviews or inline review threads.
- **Prior successful exact-source execution:** Bun 1.4.4 run [42435288822](https://github.com/eboxont-code/skyco/actions/runs/42435288822) executed `bun test src/lib/sitemap.test.ts src/lib/product-seo.test.ts` at commit [`0d56672d9f3dce23df8983abade9b565e52e4a10`](https://github.com/eboxont-code/skyco/commit/0d56672d9f3dce23df8983abade9b565e52e4a10) and passed **14/14 tests across 2 files**. The final pre-attempt PR head was [`c32b03a16f90b6ea5bfe0c537dcfb010721435c9`](https://github.com/eboxont-code/skyco/commit/c32b03a16f90b6ea5bfe0c537dcfb010721435c9). GitHub's commit comparison from the successful test commit to that PR head lists only removal of the temporary workflow and a `MASTER_PLAN.md` update; no test, route, registry, helper, sitemap or robots source changed. Thus the successful 14/14 result covers the same test and application-source blobs retained in the final PR tree.
- **Exact-final-head runner attempt:** to obtain a run associated with the then-current PR head, temporarily added a push-only workflow in [`c02bf0ac2caad181e742713c8b2d286ed38373e9`](https://github.com/eboxont-code/skyco/commit/c02bf0ac2caad181e742713c8b2d286ed38373e9). GitHub Actions run [42443188809](https://github.com/eboxont-code/skyco/actions/runs/42443188809) failed before any step started: the job had no steps, no runner assignment and no downloadable logs. One job-level rerun (attempt 2) produced the same no-step/no-log result. No test command execution is claimed for that attempt; the cause is not established, so no quota or platform explanation is inferred.
- **Cleanup:** removed `.github/workflows/verify-seo-regressions.yml` in [`84ac2c7ec3b09563c9fd702fa3183a708e2988df`](https://github.com/eboxont-code/skyco/commit/84ac2c7ec3b09563c9fd702fa3183a708e2988df). The workflow is absent from the current PR branch tree. The temporary workflow add/remove commits remain in history; no published history was rewritten.
- **PR and acceptance status:** PR [#12](https://github.com/eboxont-code/skyco/pull/12) remains open and draft, targets `main`, is 0 commits behind current `main`, and has no reviews or unresolved threads. The successful test run is tied to the earlier commit with identical test/application-source blobs; the final branch head has no successful workflow run or combined status. Full repository lint, typecheck and production build were not run. Browser-rendered metadata, crawler output, live `/llms.txt`, deployed HTTP responses and search indexing remain unverified. The Phase 1 SEO checklist and PR #12 draft status remain open.
- **Production/deployment:** no merge, production or preview deployment, deployment URL/ID, deployed SHA or live smoke check. The accessible Vercel Boxont Hobby team still lists only `neighbourhood-guidebook`, `mtdgc` and `bearbreaker`, with no SkyCo-linked project; this does not identify another production host. No DNS, hosting settings, credentials, environment variables or production data changed. Additional spend: **$0**.
- **Next eligible task:** inspect and non-destructively reconcile existing [PR #7](https://github.com/eboxont-code/skyco/pull/7), which corrects the Status page's published-versus-planned product list and removes metadata that implies continuous uptime checks. Current `main` still uses `liveProjects` for its list and does not render the `upcoming` section despite computing it; PR #7 contains the focused correction and 9/9 recorded source assertions. Reconcile its stale base without rewriting history, inspect its full diff against current main, and add/run focused source tests where feasible. The separate uptime-monitoring decision remains blocked on owner-defined scope, schedule, alert destination and retention; browser acceptance remains blocked until an interactive preview exists.

## 31. Execution log — 8 November 2026 — reconcile PR #12 and verify the current SEO test branch

- **Repository and phase selection:** re-read `README.md`, `AGENTS.md`, the full current `MASTER_PLAN.md` and `roadmap.md`; inspected current `main`, the current PR inventory, open issues, PR #12's full diff, exact test files, recent Actions history and available deployment context. Current `main` is [`64f6d3645c623d743ac90588581b97bf652af3db`](https://github.com/eboxont-code/skyco/commit/64f6d3645c623d743ac90588581b97bf652af3db), with `protected=false` and no required status checks. No open non-PR issues were returned. The connector exposes no local repository checkout or working-tree status.
- **Phase 0 eligibility:** production runtime-variable verification remains blocked by the unidentified production host and missing read-only hosting settings access; Lovable sync remains blocked by lack of access to the matching SkyCo workspace; production package-manager confirmation remains blocked by missing deployed build configuration/logs. PR #1's install/test/build workflow remains unmerged; its latest recorded result passes tests/build but fails lint on 1,606 existing Prettier errors and 10 warnings. No lint rule was weakened or mass-formatting attempted. These blockers do not prevent independent Phase 1 source-level SEO tests.
- **PR #12 reconciliation:** before reconciliation, PR #12 was 16 commits ahead and one behind current main, with no reviews, inline threads, combined statuses or workflow runs on its head. Its only missing main-side change was the latest append-only master-plan record. Created two-parent merge commit [`eca581e`](https://github.com/eboxont-code/skyco/commit/eca581ec04fe05f6648fb436fd38b1c734b84783), with previous PR head `9e937e36b8dd8bd60dfc6ff1d426eee7eb38162a` as first parent and current main `64f6d3645c623d743ac90588581b97bf652af3db` as second parent. The tree preserves both histories; the PR's existing execution records were renumbered after the newer main record. No rebase, force-push, amend or squash occurred.
- **Test/source inspection:** the PR contains six sitemap/robots tests and eight product-route SEO tests. They read the actual sitemap, robots file, five product route files, product registry, CurrenSee pair registry, Float landing-page registry and shared SEO helpers. The test source was unchanged by the reconciliation; only the master plan changed.
- **Fresh exact-branch attempt:** temporarily added a push-only test workflow in commit [`20231d5`](https://github.com/eboxont-code/skyco/commit/20231d5d8385b267f0ada09805f296814b175184). GitHub Actions [run 42474786552](https://github.com/eboxont-code/skyco/actions/runs/42474786552) failed before any step started. The job reported zero steps and no downloadable logs; no test command executed. This is the same no-runner/no-step failure previously recorded for run [42443188809](https://github.com/eboxont-code/skyco/actions/runs/42443188809). No further retry was made because the failure evidence was unchanged and no new runner evidence appeared.
- **Prior valid test evidence:** Bun 1.4.4 [run 42435288822](https://github.com/eboxont-code/skyco/actions/runs/42435288822) passed all **14/14** sitemap and product SEO tests on commit [`0d56672`](https://github.com/eboxont-code/skyco/commit/0d56672d9f3dce23df8983abade9b565e52e4a10). The intervening PR history records that the test files and application-source blobs were unchanged through the final pre-attempt branch head; this run does not claim a new successful execution on the latest head. Full repository lint, typecheck, full test suite and production build were not run.
- **Cleanup:** removed the temporary workflow in commit [`23f29582539558b7fd1c401609f531b8d76831c6`](https://github.com/eboxont-code/skyco/commit/23f29582539558b7fd1c401609f531b8d76831c6). No temporary verification workflow remains in the final PR tree.
- **PR and release state:** PR [#12](https://github.com/eboxont-code/skyco/pull/12) remains open and draft, targets `main`, and is not merged. Its test suite has prior 14/14 evidence on unchanged source, but the latest exact-head CI attempt did not execute. Browser-rendered metadata, crawler output, deployed `/llms.txt`, live sitemap responses and search indexing remain unverified. The Phase 1 SEO checklist stays unchecked.
- **Production/deployment:** no merge, preview deployment or production deployment occurred. No deployment URL/ID or deployed commit SHA is established; no live smoke check was performed. No DNS, hosting settings, credentials, environment variables, production data or secrets were changed. Additional spend: **$0**.
- **Next eligible task:** continue the independent Phase 1 queue by checking the current replacement [PR #17](https://github.com/eboxont-code/skyco/pull/17) for Status-page acceptance and exact-source verification. Keep browser, keyboard and screen-reader acceptance blocked until an accessible preview is available. Keep the Phase 0 host, Lovable workspace, deployed-toolchain and lint-baseline gates open.


## 32. Execution log — remove unsupported CurrenSee URLs from sitemap — 9 November 2026

- **Execution time:** 9 November 2026, 06:31 Australia/Brisbane. **Repository:** private `eboxont-code/skyco`. Starting `main` HEAD: [`cc3eefa`](https://github.com/eboxont-code/skyco/commit/cc3eefad39e884b6dc768122d054f6aa0377b36f). PR #12's starting head: [`547abdf`](https://github.com/eboxont-code/skyco/commit/547abdf848a82b7ab6c66586f228ee63239279ee). The PR branch was 20 commits ahead and 2 behind `main`; the only main-side files since its base were `README.md` and `MASTER_PLAN.md`. No open non-PR issues were returned. The GitHub connector exposes no local checkout or working-tree status, so no local cleanliness claim is made.
- **Phase eligibility:** Phase 0 remains open. The Vercel project linked to this repository is identified, but its READY production deployment lists only Vercel hostnames, not `skyco.online` or `www.skyco.online`; project metadata reports `live=false`, and its environment listing has 0 visible and 0 hidden variables. The Float waitlist server function requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; if this project serves the public site, those settings are absent. The actual public-domain mapping and runtime configuration therefore remain unverified. Access to the correct Lovable workspace is still missing, and PR #1's general CI/lint baseline remains unresolved. These gates do not block this independent Phase 1 sitemap correction.
- **Overlap and branch review:** PR #12 already contains six sitemap/robots tests and eight product-route SEO tests; it has no submitted reviews or unresolved review threads. PR #5 separately covers the generated `llms.txt` planned-product wording and six tests. PR #9 is closed unmerged and superseded by PR #15; the old Chronos PRs #4/#8 are closed. Reconciled PR #12 with current `main` using a two-parent merge commit, keeping the PR head as first parent and current `main` as second parent. The branch history was not rebased or rewritten.
- **Source finding:** `public/sitemap.xml` contained 59 URLs, including 34 CurrenSee pair pages. The current `PAIRS` registry contains only 29 supported slugs. The five extras — `cad-to-npr`, `sgd-to-npr`, `kwd-to-npr`, `bhd-to-npr` and `hkd-to-npr` — are not registered. The dynamic pair route calls `pairBySlug` and throws `notFound()` when no registered pair exists, so those five sitemap entries point to unavailable pages. This supersedes the earlier historical audit entries that reported 34 pair URLs matching the registry.
- **Change:** removed only those five unsupported URL entries from `public/sitemap.xml`. The sitemap now contains 54 URLs: 29 supported CurrenSee pair pages, all eight Float landing pages, all five shipped product roots and the existing guide/legal pages. The two planned products and legacy `/finance` redirect remain excluded. `robots.txt` is unchanged and still points to the canonical sitemap.
- **Verification:** **74/74 focused source assertions passed** against the exact fetched current-main sources and proposed sitemap. Checks cover unique canonical HTTPS URLs, all five shipped products, planned-product exclusion, exact 29-pair and eight-Float registry matches, valid ISO `lastmod` dates, the robots directive, all five routes' canonical/Open Graph/Twitter/image-alt/SoftwareApplication/breadcrumb wiring, both shared structured-data helpers, and the generated `llms.txt` fallback/live/planned behavior. The current main `llms.txt` heading still says “On the way”; PR #5 already proposes the clearer “Planned — not live yet” wording and six regression tests. This was an in-memory source audit, not a Bun package-script or full-repository test run. The earlier 14/14 Bun run for PR #12 predates this sitemap correction and is not claimed as current-head evidence. No new GitHub Actions run was available; the prior runner attempts failed before any step started, so they were not repeated.
- **PR/release status:** updated [PR #12](https://github.com/eboxont-code/skyco/pull/12) to include the sitemap correction and its existing regression tests. It remains a draft, open and unmerged. No production merge or deployment was attempted. Browser/crawler output, live sitemap HTTP response, rendered metadata and search indexing remain unverified; the Phase 1 SEO checklist stays unchecked.
- **Next eligible task:** reconcile the existing [PR #5](https://github.com/eboxont-code/skyco/pull/5) with current `main`, then verify its six `llms.txt` tests and the clearer planned-product wording against the current registry. Keep live crawler verification separate until a matching accessible preview or confirmed production host is available.
- **Impact/cost:** source and test coverage only. No production behavior outside sitemap discovery, hosting settings, DNS, secrets, credentials, environment variables or production data changed. No production deployment occurred. Additional spend: **$0**.

## 33. Execution log — verify the automatic PR #12 preview — 9 November 2026

- **Preview deployment:** after the PR branch update, Vercel created deployment [`dpl_6eGqcCxNsSXsVcMBcFVofe9n7jiG`](https://vercel.com/boxont/skyco/6eGqcCxNsSXsVcMBcFVofe9n7jiG) for exact commit [`612fa7a0`](https://github.com/eboxont-code/skyco/commit/612fa7a0e2809e866287e079156aee9c84af361b). Vercel reports `READY`, branch `test/sitemap-registry-coverage`, and preview alias [`skyco-git-test-sitemap-registry-coverage-boxont.vercel.app`](https://skyco-git-test-sitemap-registry-coverage-boxont.vercel.app). Its deployment target is `null`, so this is a preview, not a production deployment.
- **Live verification limit:** the preview has SSO protection enabled for non-custom domains. The available browser fetch of `/sitemap.xml` could not access the preview, so no live HTTP or browser smoke check is claimed. The GitHub Vercel status remains `pending` even though the deployment record is READY; no GitHub Actions workflow run exists for this head.
- **Production impact:** no merge to `main`, production deployment, DNS change, hosting configuration change, environment-variable change or production-data write occurred. The preview's exact source commit is the PR head above; it must not be described as live on the public site. Additional spend: **$0**.
- **Next step:** retain the PR as draft until the required human review and accessible browser/crawler verification are available. The next independent source task remains the separate `llms.txt` correction in PR #5; public-host/runtime and live crawler gates remain open.


## 34. Execution log — reconcile and re-verify sitemap/product SEO work — 9 November 2026

- **Execution time:** 9 November 2026, 12:18 Australia/Brisbane. Re-read `README.md`, `AGENTS.md`, this master plan and `roadmap.md`; inspected current `main`, the complete open-PR inventory, open issues, PR #12's diff/tests, recent Actions runs and read-only deployment evidence. Current `main` is [`1ad3297173bcb60c8946f796640e7b146e58ab08`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08). GitHub reports 13 open PRs and no open non-PR issues; `main` is not protected and has no required status checks. The connector exposes no local checkout or working-tree status, so no local cleanliness claim is made.
- **Phase 0 eligibility:** runtime-variable verification remains blocked because the connected Vercel project does not establish that it serves the public custom domain; the latest READY production-target record is for older main commit [`760d810`](https://github.com/eboxont-code/skyco/commit/760d810ceec331c39b8d4a106a3d0fc8efda7537), while the newer production-target attempt for [`cc3eefad`](https://github.com/eboxont-code/skyco/commit/cc3eefad39e884b6dc768122d054f6aa0377b36f) is CANCELED. Current main `1ad329` has no matching production deployment record. The project still reports `live=false` and 0 visible / 0 hidden environment variables. The exact production-host identity and read-only runtime settings remain missing. Lovable sync remains blocked by lack of access to the correct SkyCo workspace. PR #1's test/CI workflow remains off main; its two latest runs [42502786853](https://github.com/eboxont-code/skyco/actions/runs/42502786853) and [42503356466](https://github.com/eboxont-code/skyco/actions/runs/42503356466) failed before any job step started. The earlier lint baseline remains 1,606 formatting errors and 10 warnings; no rules were weakened or broad formatting attempted.
- **Phase 1 candidate selection:** the uptime-monitoring decision still needs an owner-defined probe scope, schedule, alert destination and retention; rate-service monitoring depends on an actual monitor; mobile-flow and keyboard/screen-reader acceptance require an accessible interactive browser preview. Those candidates remain blocked. The source-only sitemap and product-route SEO task is independent of those gates and remains eligible.
- **PR #12 inspection:** PR #12 targets `main`, is open/draft, and changes only `MASTER_PLAN.md`, `public/sitemap.xml`, `src/lib/sitemap.test.ts` and `src/lib/product-seo.test.ts`. Before reconciliation its head was [`2587801`](https://github.com/eboxont-code/skyco/commit/2587801cf39c7bd10e38c2bb245313e5c01c0922), 22 commits ahead and 2 behind current main. It has no submitted reviews or unresolved inline review threads.
- **Source findings:** current main's sitemap has 59 URLs and 34 CurrenSee pair entries, but the current pair registry has only 29 supported slugs. The five unregistered entries are `cad-to-npr`, `sgd-to-npr`, `kwd-to-npr`, `bhd-to-npr` and `hkd-to-npr`; the PR sitemap removes them. The proposed sitemap has 54 unique canonical HTTPS URLs: 29 registered CurrenSee pairs, 8 registered Float pages, all 5 shipped product roots, and existing guide/legal pages. The two planned products and legacy `/finance` redirect are excluded. All `lastmod` values are valid ISO dates and `robots.txt` points to the canonical sitemap. All five product routes use matching canonical, Open Graph, Twitter, image-alt, SoftwareApplication and breadcrumb paths. The shared structured-data helpers derive URLs from the same first-party paths. The current `llms.txt` route uses the shared live/upcoming directory split and fallback; upcoming products are described without product URLs. Its current heading remains “On the way”; PR #5 separately proposes the clearer “Planned — not live yet” wording.
- **Verification:** executed 104 in-memory source assertions against exact fetched GitHub blobs for the proposed sitemap, robots file, five product routes, product/pair/Float registries, shared SEO helpers and `llms.txt` source: **104 passed, 0 failed**. PR #12 contains 6 sitemap/robots and 8 product-route SEO `node:test` cases. The earlier Bun 1.4.4 run [42435288822](https://github.com/eboxont-code/skyco/actions/runs/42435288822) is historical evidence only; it predates the final sitemap correction and is not claimed as a current-head test run. The previous runner attempts [42443188809](https://github.com/eboxont-code/skyco/actions/runs/42443188809) and [42474786552](https://github.com/eboxont-code/skyco/actions/runs/42474786552) failed before any test step; no unchanged retry was made. Full package-script tests, lint, typecheck and build were not run.
- **Preview/production evidence:** Vercel deployment [`dpl_HEqxeFuTuqV4Aj6SMG2Txd7FaZK8`](https://vercel.com/boxont/skyco/HEqxeFuTuqV4Aj6SMG2Txd7FaZK8) is READY for exact pre-reconciliation PR head `2587801`, with target `null` (preview). It is SSO-protected; no browser/crawler fetch or interactive smoke test was performed. Latest production-target deployment history shows the newer `cc3eefad` attempt CANCELED and the last READY production-target deployment on `760d810`; no production deployment of this PR occurred.
- **Reconciliation:** preserved the PR's published history with a two-parent merge commit; the existing PR head remains the first parent and current main is the second parent. No rebase, force-push, amend or squash was used. The Phase 1 SEO checklist remains unchecked until public crawler/live HTTP and rendered metadata verification are possible.
- **PR/release status:** PR #12 remains open and draft; no merge to main or production deployment was attempted. No deployment URL/ID or deployed SHA exists for this reconciliation commit. No production data, DNS, hosting settings, secrets, credentials or environment variables were changed. Additional spend: **$0**.
- **Next eligible task:** reconcile the existing [PR #5](https://github.com/eboxont-code/skyco/pull/5) with current main and verify its six generated `llms.txt` tests plus the planned-product wording against the live registry. Keep public crawler verification and all Phase 0 release gates open.


## 35. Preview verification follow-up — 9 November 2026

- After the two-parent reconciliation commit [`a9da1be`](https://github.com/eboxont-code/skyco/commit/a9da1beab9b338e85fe6097fa0cff4bcb0885ae1) was pushed to the PR branch, Vercel automatically created preview deployment [`dpl_EfDhnCs63Dxxv59aysh5Lx7iXN2e`](https://vercel.com/boxont/skyco/EfDhnCs63Dxxv59aysh5Lx7iXN2e) for that exact commit. Read-only deployment inspection confirms state **READY**, branch `test/sitemap-registry-coverage`, target `null` (preview), and alias `skyco-git-test-sitemap-registry-coverage-boxont.vercel.app`.
- The preview is protected by Vercel SSO. No browser/crawler fetch, rendered metadata inspection or interactive smoke test was performed; no temporary share link or access-control change was created.
- This is a preview build only. It did not trigger a production deployment, does not change the latest production-target deployment, and does not prove the public-domain sitemap is live. The latest READY production-target record remains on main commit `760d810`; the later `cc3eefad` production-target attempt remains CANCELED.
- The PR remains open/draft and unmerged. No GitHub Actions run exists for the reconciliation commit. The source-level 104/104 assertions remain the current verification; the 14 committed `node:test` cases have no fresh exact-head runner result.
- No production settings, DNS, credentials, secrets, environment variables, database or customer data changed. Additional spend: **$0**.


## 36. Execution log — 9 November 2026 — complete source-only SEO output audit

- **Execution time:** 9 November 2026, 14:50 Australia/Brisbane. Re-read `README.md`, `AGENTS.md`, this complete master plan and `roadmap.md`; inspected current `main` at [`1ad3297`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08), all 13 open PRs, open non-PR issues (none), recent Actions evidence, the relevant current-main and PR-branch files, and read-only Vercel deployment records. GitHub's connected tools expose no local checkout or working-tree status, so no local cleanliness claim is made.
- **Phase 0 eligibility:** runtime configuration remains blocked: the linked Vercel project reports `live=false`, no deployment record matches current main `1ad3297`, the latest READY production-target record is for older main `760d810`, and the newer `cc3eefad` production-target attempt is CANCELED. The exact public-origin/runtime mapping and read-only settings evidence remain missing. Lovable sync remains blocked by lack of access to the correct SkyCo workspace. PR #1's reproducible test/CI proposal remains off main; the latest recorded runner attempts failed before any job step, while the earlier lint baseline remains 1,606 Prettier errors and 10 warnings. No unchanged runner was retried, no lint rule was weakened and no broad formatting was attempted. These gates do not block this independent Phase 1 source audit.
- **Overlap review:** PRs #4 and #8 are closed unmerged; the seven-calendar Chronos correction is already present on current main. PR #9 is closed unmerged and its PWA-copy work is superseded by open PR #15. PR #5 is open, non-draft, 23 commits ahead and 0 behind current main; it changes homepage/WebMCP planned-product wording and the generated `llms.txt` helper/route/tests. PR #12 is open/draft, 24 commits ahead and 0 behind current main; its application diff is limited to `public/sitemap.xml` and two focused test files. PR #5 and #12 have no overlapping application files.
- **Sitemap findings:** current main's `public/sitemap.xml` still contains 59 URLs, including five unregistered CurrenSee pairs: `cad-to-npr`, `sgd-to-npr`, `kwd-to-npr`, `bhd-to-npr` and `hkd-to-npr`. PR #12's sitemap contains 54 unique canonical HTTPS URLs: all five shipped product roots, exactly 29 registered CurrenSee pairs, exactly 8 registered Float landing pages and the existing guide/legal pages. It excludes the five unsupported pairs, both planned products and the legacy `/finance` redirect. Every URL has one valid ISO `lastmod` date. Current `robots.txt` already points to `https://skyco.online/sitemap.xml`.
- **Route metadata findings:** the five shipped product routes use matching first-party canonical, Open Graph and Twitter URLs, shared SoftwareApplication metadata and first-party breadcrumb paths. Dynamic CurrenSee pair and Float landing pages derive canonical/Open Graph URLs from their registered slugs; the shared structured-data helpers use `https://skyco.online` as their site root. The registry still has exactly five shipped paths and two route-less planned products.
- **AI-readable directory overlap:** current main's `llms.txt` already separates live and upcoming products and uses the registry fallback, but its heading remains “On the way”. PR #5 separately changes this to “Planned — not live yet”, keeps planned entries free of product URLs, preserves the static fallback and one-hour plain-text cache, and adds six focused tests. This is separate from PR #12's sitemap/SEO files.
- **Verification:** **25/25 in-memory source assertions passed** against the exact fetched main/PR blobs. They covered the 59-to-54 sitemap correction, uniqueness/canonical URLs/last-modified dates, exact registry parity for 29 CurrenSee pairs and 8 Float pages, all five product roots, planned/legacy exclusions, robots, all five product metadata/structured-data routes, dynamic pair/Float metadata, and PR #5's `llms.txt` separation/fallback. PR #12 contains 6 sitemap/robots and 8 product-route SEO test cases. Historical Bun run [42435288822](https://github.com/eboxont-code/skyco/actions/runs/42435288822) predates the final sitemap correction and is not a current-head result. No GitHub Actions run exists for exact PR #12 head `2eaf727`; full package-script tests, lint, typecheck and build were not run because no local checkout/Bun runtime is exposed.
- **Preview/release evidence:** PR #12's exact head [`2eaf727`](https://github.com/eboxont-code/skyco/commit/2eaf72722403e184247be4e24f99ed01f8e94bcf) has a failed Vercel status pointing to the free daily build limit and no matching deployment record. The earlier READY preview [`dpl_EfDhnCs63Dxxv59aysh5Lx7iXN2e`](https://vercel.com/boxont/skyco/EfDhnCs63Dxxv59aysh5Lx7iXN2e) is for reconciliation commit `a9da1be`, is SSO-protected and was not browser/crawler-tested. The latest READY production-target deployment remains on older main `760d810`; current main `1ad3297` has no matching production record. The Vercel project still reports `live=false`. No live crawler, rendered-metadata or production smoke test is claimed.
- **PR/release status:** PR #12 still targets main, is open/draft and GitHub reports it mergeable; exact head `2eaf72722403e184247be4e24f99ed01f8e94bcf`, 24 commits ahead and 0 behind. No submitted reviews or unresolved review threads were found. Keep it draft and unmerged: exact-head automated tests and accessible preview/browser verification are absent, and Phase 0 production-release evidence remains incomplete. No production deployment was triggered; no DNS, hosting/runtime settings, secrets, credentials, environment variables or production data were changed. Additional spend: **$0**.
- **Next eligible task:** continue the independent Phase 1 PWA-copy/manifest task in [PR #15](https://github.com/eboxont-code/skyco/pull/15). PR #9 is already closed as superseded. PR #15 changes only the CurrenSee install hint, its page copy and the PWA manifest; it is 6 commits ahead and 5 behind current main, so first inspect and reconcile that published branch with a non-rewriting two-parent merge, then re-verify its source assertions. Keep actual browser installation/Safari Add to Home Screen checks separate until an accessible preview is available.
- **Impact/cost:** this run changed only the PR #12 master-plan record; no application code, main branch, production deployment, DNS, hosting configuration, credentials or production data changed. Additional spend: **$0**.

## 37. Preview verification follow-up — 9 November 2026

- The documentation-only audit commit [65c6c09](https://github.com/eboxont-code/skyco/commit/65c6c095551464d30d87c5531d8d753f2efaea10) triggered Vercel preview deployment [dpl_BJnao6oaLEh6FrQ9Vbx3x5AzhUBL](https://vercel.com/boxont/skyco/BJnao6oaLEh6FrQ9Vbx3x5AzhUBL), which reached **READY** for that exact commit. Target is null (preview), branch test/sitemap-registry-coverage, alias skyco-git-test-sitemap-registry-coverage-boxont.vercel.app; it is not production.
- The exact-head GitHub Vercel status is **success**. Build events confirm Bun 1.3.14, frozen dependency installation with no changes, successful Vite client and SSR builds, Nitro's Node 24 runtime and “Deployment completed”. The build emitted non-blocking Node deprecation and large-chunk warnings. No GitHub Actions workflow run exists for this head; no tests or lint ran in the preview build.
- The preview is protected by Vercel SSO. No browser/crawler or interactive smoke check was performed; no temporary share link or access-control change was created. The source audit's 25/25 in-memory assertions remain the current focused verification. The committed 14-test suite has no exact-head runner result.
- PR #12 remains open/draft and unmerged. The preview is a branch preview only; no production deployment was triggered and no production commit changed. The Vercel project still reports live=false; the latest READY production-target deployment remains tied to older main 760d810. Keep the SEO checklist and production release gate open pending accessible live crawler/rendered-metadata verification and the required Phase 0 evidence.
- No DNS, hosting/runtime settings, credentials, secrets, environment variables, production data or access controls were changed. Additional spend: **$0**.


## 38. Execution log — 9 November 2026 — execute PR #12 sitemap and product SEO regression tests

- **Execution time:** 9 November 2026, 17:52 Australia/Brisbane. Re-read `README.md`, `AGENTS.md`, the complete current `MASTER_PLAN.md` and `roadmap.md`; inspected current `main` at [`1ad3297`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08), the relevant open PRs/issues, exact PR #12 files and review state, recent GitHub Actions evidence, and read-only Vercel deployment records. No standalone open issues were returned. The GitHub connector exposes no local repository checkout or working-tree status, so no local cleanliness claim is made.

- **Phase-gate assessment:** Phase 0 remains open. No production-target Vercel deployment exists for current main `1ad3297`; the latest READY production-target deployment is for older main `760d810`, and the newer production attempt for `cc3eefad` is CANCELED. Runtime-host identity and read-only settings evidence remain incomplete; Lovable sync still requires access to the correct editor workspace. PR #1's general test/CI workflow remains off main; no current-main Actions run exists and the recorded lint baseline remains 1,606 Prettier errors plus 10 warnings. The source-backed privacy/security checklist items are already checked on current main, and PR #12 changes no storage, API, provider or personal-data flow. These Phase 0 gates do not block this independent Phase 1 SEO test task.

- **PR #12 inspection:** [PR #12](https://github.com/eboxont-code/skyco/pull/12) targets `main`, is open and draft, and GitHub reports it mergeable. Exact head is [`4f0b949`](https://github.com/eboxont-code/skyco/commit/4f0b949239765ef78bd2f3f1c1f9b164b46638ce), based on current main [`1ad3297`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08); comparison reports 26 commits ahead and 0 behind. The four-file diff is limited to this plan, the sitemap correction and two focused test files. PR #5's homepage/WebMCP and `llms.txt` changes are separate; PR #9 is closed. PR #12 has no submitted reviews or unresolved review threads.

- **Source findings:** the proposed sitemap contains 54 unique canonical HTTPS URLs, exactly 29 registered CurrenSee pair pages and 8 registered Float landing pages, all five shipped product roots, and no planned-product URLs, legacy `/finance` redirect or unsupported pair URLs. Every entry has one valid ISO date. `robots.txt` points to the canonical sitemap. The five product routes use matching first-party canonical, Open Graph, Twitter, SoftwareApplication and breadcrumb URLs. The registry contains five shipped product paths and two route-less planned products.

- **Focused test execution:** Node v22.16.0 ran the 14 cases from PR #12's two test files in an isolated temporary fixture: **14 passed, 0 failed**. The exact PR test logic was used with the fetched sitemap/robots data, source-derived project/pair/Float registry slug/path data, the fetched SEO helper implementation and exact metadata excerpts from all five product routes. Import paths were made explicit only in the temporary fixture for Node's TypeScript resolver. This is not a full repository checkout or a Bun 1.3.14 package-script run; the fixture represents the registry arrays by their exact fetched slug/path values rather than importing the full registry modules. No full lint, typecheck or production build was run. A direct source comparison also confirmed 54 sitemap entries, no duplicates, 29/29 pair paths and 8/8 Float paths.

- **Current-head checks and preview:** no GitHub Actions workflow run exists for exact PR head `4f0b949`; the combined GitHub status contains only a successful Vercel check. Read-only Vercel inspection confirms preview deployment [`dpl_4mF8GDUSfqyiPseqznAmLnb1c9NP`](https://vercel.com/boxont/skyco/4mF8GDUSfqyiPseqznAmLnb1c9NP) is **READY** for exact SHA `4f0b949`, branch `test/sitemap-registry-coverage`, target `null` (preview), alias `skyco-git-test-sitemap-registry-coverage-boxont.vercel.app`. The preview is SSO-protected; no browser, crawler or rendered-metadata smoke check was possible. The latest READY production-target record remains on older main `760d810`; no production record exists for current main `1ad3297`.

- **PR/release status:** PR #12 remains open/draft and unmerged. No main merge or production deployment was attempted because the Phase 0 release gate remains open. The READY deployment above is a preview, not production. No DNS, hosting/runtime settings, credentials, secrets, environment variables, database or customer data changed. Additional spend: **$0**.

- **Next eligible task:** PR #15's source/manifest assertions are already recorded as 15/15 passed, but browser installation, Safari Add to Home Screen and live-manifest checks remain blocked by its SSO-protected preview and the unconfirmed public host. Continue with the independent test-only [PR #16](https://github.com/eboxont-code/skyco/pull/16): reconcile its two-commit branch (currently 4 commits behind main) with a history-preserving two-parent merge, then run its three Chronos metadata tests against current-main source. Keep PR #15's manual checks and all Phase 0 release gates open.


## 39. Execution log — verify public SEO endpoints and refresh hosting evidence — 9 November 2026

- **Execution time:** 9 November 2026, 19:31 Australia/Brisbane. Re-read `README.md`, `AGENTS.md`, the complete current plan and `roadmap.md`; inspected current `main` at [`1ad3297`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08), open PRs/issues, recent Actions runs, PR #12's exact source/tests/review state, and current Vercel records. GitHub reports `main` is unprotected; no standalone open issues were returned. The connector exposes no local checkout or working-tree status, so no local cleanliness claim is made.

- **Phase 0 host/runtime evidence:** the linked Vercel `skyco` project is identified and connected to this repository. Its `skyco.online` and `www.skyco.online` domain records are verified, and both domains are aliases on READY production deployment [`dpl_EpsCEYe3L3hDkavF9DTBc7tSPFyb`](https://vercel.com/boxont/skyco/EpsCEYe3L3hDkavF9DTBc7tSPFyb), sourced from older main commit [`760d810`](https://github.com/eboxont-code/skyco/commit/760d810ceec331c39b8d4a106a3d0fc8efda7537). Read-only requests to the apex and `www` origins returned HTTP 200 with Vercel server headers. The project still reports `live=false`; the production deployment list has no record for current main `1ad3297`, and the newer production-target attempt for `cc3eefad` is CANCELED. The non-decrypted environment listing returned 0 visible and 0 hidden variables. The source requires Supabase browser configuration and service-role configuration for the Float waitlist path. The host is now identified as the configured Vercel project, but runtime-variable completeness and whether that project is the active runtime for every request remain **BLOCKED** pending owner confirmation/configuration evidence. No variable values were read or changed.

- **Lovable sync gate:** the only accessible Lovable workspace is `Bear's Lovable`, with projects `BearBreaker` and `Mtdgc`; no SkyCo project appears. The SkyCo project ID recorded in README returns 404. The correct workspace/project remains inaccessible, so the Lovable connection and sync gate stays open.

- **Public SEO smoke check:** `https://skyco.online/sitemap.xml` and `https://www.skyco.online/sitemap.xml` both returned HTTP 200 and the same 59 unique URLs. The sitemap still includes the five unsupported CurrenSee pair paths `cad-to-npr`, `sgd-to-npr`, `kwd-to-npr`, `bhd-to-npr` and `hkd-to-npr`; all five shipped product roots are present and planned products are absent. `robots.txt` returned 200 and points to the canonical apex sitemap. `llms.txt` returned 200, lists five live products, and still uses the “On the way” heading for the two planned products. These are public HTTP checks, not interactive browser, search-indexing or rendered-metadata checks.

- **PR #12 state:** [PR #12](https://github.com/eboxont-code/skyco/pull/12) remains open, draft and unmerged, targeting `main`; exact head is [`4b4c918`](https://github.com/eboxont-code/skyco/commit/4b4c918fae33e1b465472c2d018a6b2797231a5c), based on current main `1ad3297`. Its application correction removes the five unsupported sitemap URLs. The matching Vercel deployment [`dpl_94bcKZfWpzHhvQQ9UzfZ2Tn8ANJw`](https://vercel.com/boxont/skyco/94bcKZfWpzHhvQQ9UzfZ2Tn8ANJw) is READY for this exact branch head, target `null` (preview), not production. There is no GitHub Actions run for the exact head and no submitted review or unresolved review thread. The existing 14/14 Node 22.16 fixture result is recorded in §38; it is not a Bun 1.3.14 or full-repository test run and was not repeated in this execution.

- **Release decision:** the public sitemap confirms PR #12's fix is not live. Do not merge while the Phase 0 runtime configuration, Lovable sync and reproducible CI/lint gates remain open. The preview's READY state is not production evidence. No merge, production deployment, DNS, hosting setting, environment variable, credential, secret or production-data change occurred. Additional spend: **$0**.

- **Next eligible task:** continue with the independent test-only [PR #16](https://github.com/eboxont-code/skyco/pull/16): inspect its current diff against main, reconcile the published branch with a two-parent merge if still needed, and run its three Chronos metadata tests against current source. Keep production crawler/release and interactive accessibility gates open.


## 39. Execution log — 9 November 2026 — correct sitemap pair registry parity and rerun SEO tests

- **Execution time:** 9 November 2026, 21:35 Australia/Brisbane. Re-read `README.md`, `AGENTS.md`, this complete plan and `roadmap.md`; inspected current `main` HEAD [`1ad3297`](https://github.com/eboxont-code/skyco/commit/1ad3297173bcb60c8946f796640e7b146e58ab08), PR #12's exact source/test/plan blobs, PR #5/#9 overlap, open PR/issue state, current-head CI and Vercel preview evidence. GitHub reports `main` unprotected with no required checks; no open non-PR issues were returned. The connected GitHub tools expose no local checkout or local working-tree status, so no local cleanliness claim is made.
- **Phase eligibility:** Phase 0 remains open. Runtime/Supabase configuration still needs owner-confirmed public-host identity and read-only settings access; the correct SkyCo Lovable workspace remains unavailable; PR #1's reproducible CI integration and existing lint baseline remain unresolved. These gates do not block the independent Phase 1 SEO regression tests. PR #5 is separate: it changes homepage/WebMCP planned-product wording and generated `llms.txt`; PR #9 is closed and superseded by PR #15.
- **Root cause of the prior sitemap claim:** the earlier source audit counted pair entries with a pattern that matched unquoted `slug:` keys but missed five objects whose property is written as quoted `"slug":`. The actual `PAIRS` registry contains **34** entries, not 29. The dynamic route `src/routes/currensee_.$pair.tsx` resolves registered entries through `pairBySlug`; the five entries were not unregistered. The route can show its unavailable-rate message if the current NRB payload lacks a row, but it remains a registered route with canonical metadata. Nepal Rastra Bank's official 9 November 2026 board lists CAD, SGD and HKD; KWD and BHD are not listed on that day's rendered board, so no current-rate claim is made for those two. Source: https://www.nrb.org.np/forex/ .
- **Correction:** PR #12's prior sitemap had 54 URLs after deleting those five still-registered pair paths. Replaced `public/sitemap.xml` on the PR branch with the exact current-main file (59 URLs), restoring all 34 registered CurrenSee pair paths. The sitemap now matches the actual product, pair and Float registries; planned products and the legacy `/finance` redirect remain excluded. The sitemap file is now identical to `main`, so PR #12's remaining changes are the two focused test files and the plan only. No application behavior or production file was changed on `main`.
- **Test execution:** ran the exact 14 test cases from `src/lib/product-seo.test.ts` and `src/lib/sitemap.test.ts` in an isolated Node.js 22.16.0 fixture using `--experimental-strip-types`. With the 54-URL sitemap, **13 passed and 1 failed**: the pair-registry parity test identified the five missing registered URLs. After restoring the 59-URL sitemap, **14 passed, 0 failed across two files**. The fixture used the exact test logic and fetched source-derived slug/path arrays, SEO helper behavior and relevant metadata excerpts from all five routes; it was not a full repository checkout or direct import of every complete registry module. This is not a Bun 1.3.14 package-script run. Full repository tests, lint, typecheck and production build were not run.
- **PR #12 state:** updated the existing branch without rewriting published history. The sitemap-restoration commit is [`a78dd8e`](https://github.com/eboxont-code/skyco/commit/a78dd8e14d387f83a22f89fa15d6ee972ba2be72). The PR is now test-only sitemap/product-SEO coverage; its base remains `main`. No submitted reviews or unresolved review threads were present. Exact head [`a666e60`](https://github.com/eboxont-code/skyco/commit/a666e60c3ffd9225ddbfd8c3f1916c623c8dc711) has no GitHub Actions run. Its Vercel check failed at the free daily deployment limit and no deployment record exists for that SHA; the latest READY preview is for older head `b932a54`, not the current head. That older preview is SSO-protected, so no current-head browser/crawler smoke check is claimed.
- **Release/impact:** no merge into `main`, production deployment, DNS/hosting/runtime change, credential/secret/environment-variable access or production-data write occurred. The Phase 0 release gate and public crawler/rendered-metadata checks remain open. Additional spend: **$0**.
- **Next eligible task:** recheck the existing [PR #5](https://github.com/eboxont-code/skyco/pull/5) against current `main`, then verify its six generated `llms.txt` tests and planned-product wording on the exact current source. Keep public crawler verification and all Phase 0 release gates open.
