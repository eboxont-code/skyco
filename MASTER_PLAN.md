# SkyCo Master Plan
## Website hardening → shared product services → Android application

**Plan version:** 1.0  
**Last aligned with repository:** 7 November 2026  
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
- `bun.lock` and `bunfig.toml` are committed. The current README documents Bun for local development (`bun install --frozen-lockfile`). The production deployment/build toolchain remains unverified; do not infer it from repository-local files or add a second lockfile.
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

- [x] Review repository history and current branch before making product changes; re-verified 6 November 2026: `main` HEAD is `407e22d4e3101e7845168a623ccf65b79a692179`, there are no open issues, PR #1 is open and PR #3 is an open draft, and the branch API reports `protected=false` with no required status checks.
- [x] Secret-scan the tracked `.env` file and repository history without copying secret values into issues, logs or AI prompts; Gitleaks v8.30.1 scanned full reachable history on 6 November 2026 and reported no leaks (Actions run `42201818522`).
- [x] Review Gitleaks findings for committed credentials; no findings were reported, so no credential owner/scope/rotation follow-up was triggered by this scan. Hosting logs and runtime credentials remain a separate review.
- [x] Add `.env` / `.env.*` ignore rules (while allowing `.env.example`) and add a placeholder-only `.env.example`; verified on main 5 November 2026.
- [ ] Confirm deployment/runtime variables are configured in the hosting platform, not committed to Git. **Blocked:** the production host/project is not identified; this requires its exact project identity and read-only access to the environment-variable settings.
- [ ] Confirm `main` remains a working Lovable-connected branch; use normal commits only. **Blocked:** requires read-only access to the connected Lovable project workspace to verify connection and sync status.
- [x] Establish branch/PR and rollback conventions in `AGENTS.md`; explicitly preserve Lovable-connected history and document safe revert/deployment recovery rules (6 November 2026).
- [ ] Choose and document the canonical package manager (Bun is indicated by the committed `bun.lock` and `bunfig.toml`; verify the deployment toolchain before locking this in). **Blocked:** requires the actual production build/deployment configuration or build logs; repository-local Bun files do not establish the deployed toolchain.
- [ ] Add a reproducible test command for existing Node tests. **Implemented on open PR #1, not yet on `main`:** the latest run passed 29 tests across 8 files.
- [ ] Add CI for install, lint, test and production build; do not claim CI coverage until a workflow exists and passes. **Implemented on open PR #1, not yet on `main`:** run `42213036495` passed unit tests and production build, but ESLint failed on 1,606 existing Prettier errors and 10 warnings. Keep the lint gate open; do not disable lint or mass-format unrelated files.
- [ ] Record the baseline website build, lint and test results before product changes. **Evidence is recorded on open PR #1 but is not yet integrated on `main`;** tests/build pass and the existing lint baseline fails as noted above.
- [x] Maintain a short Architecture Decision Record for material changes; accepted decision `docs/decisions/ADR-0001-website-and-android-boundary.md` records the website/native Android boundary and delivery constraints (7 November 2026).



### Phase 1 — website correctness, privacy and experience (P0/P1)

#### Product inventory and copy

- [x] Treat `src/lib/projects.ts` as the product registry source of truth; verified the five shipped first-party route literals and planned-only Budget & Expenses / Daily Notes entries on 6 November 2026.
- [ ] Correct Chronos registry job/tagline/copy from six to seven systems.
- [ ] Correct the Chronos page title and all stale six-calendar text.
- [x] Verify all five shipped product cards and routes point to `skyco.online/<product>`; 7 November 2026: registry slugs/paths, typed ToolsGrid links, route declarations, canonical/OG/SoftwareApplication URLs and sitemap entries match `/currensee`, `/chronos`, `/finance-friend`, `/grocery` and `/float`. Live home-card click-through opened all five expected pages.
- [ ] Keep Budget & Expenses and Daily Notes clearly planned, not live. **Implementation submitted on PR #5:** homepage, WebMCP and `/llms.txt` use “Planned — not live yet”; remains unchecked pending review and runtime verification.
- [x] Remove obsolete separate-subdomain instructions from active project guidance; retain history with a clear superseded label. 7 November 2026: README and AGENTS.md already specify the first-party hub; corrected §1.2 to reference the actual historical proposal in `roadmap.md` (the referenced `.lovable/plan.md` path is absent from the current tree), labelled that proposal superseded/do-not-execute, and retained the original mapping. No DNS or hosting redirect state is claimed or changed.
- [x] Align README's canonical live URL with `https://skyco.online`; verified in `README.md` on 6 November 2026.
- [x] Add project-document links to README: `MASTER_PLAN.md`, `roadmap.md`, `AGENTS.md`; all three links verified on 6 November 2026.

#### Privacy and security claims

- [ ] Re-audit every product's browser/device/server/third-party data flow from code.
- [ ] Update `/privacy` to cover all five shipped tools, including Float.
- [ ] Update `/security` table to cover all five shipped tools.
- [ ] Document CurrenSee favorites, defaults, saved snapshots, alert preferences and alert history in browser storage accurately.
- [ ] Document Grocery per-pack checked items and household-size persistence accurately.
- [ ] Document Float's opt-in guest-mode local storage accurately, including the fact that current browser storage is not application-level encrypted.
- [ ] Document Float share-link contents and Base64's lack of confidentiality.
- [ ] Add a clear pre-share disclosure and explicit confirmation for Float share links, or replace the current mechanism after a tested privacy design.
- [ ] Document support email handling, hosting logs and each third-party rate provider based on current implementation.
- [ ] Ensure no page claims that data is never stored if the product stores it locally.
- [ ] Ensure no page claims encryption, continuous monitoring, authentication or sync unless the feature is implemented and verified.
- [ ] Re-check all claims after any change to local storage, API calls or third-party SDKs.

#### Reliability, accessibility and SEO

- [ ] Keep the Status page's distinction between a published route and uptime monitoring.
- [ ] Decide whether to add independent uptime checks; if added, define probe scope, schedule, alert destination and retention.
- [ ] Add explicit rate-service freshness/provider failure monitoring only after the monitor exists.
- [ ] Check all five product flows on narrow Android-sized browser viewports and desktop.
- [ ] Check keyboard navigation, focus order, screen reader labels, contrast and text scaling.
- [ ] Verify SEO titles, canonical URLs, structured data, sitemap and `llms.txt` reflect the five live routes and two planned entries.
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

**Next action:** ADR-0001 is accepted and checked in. No additional independent Phase 0 task is currently executable without user-only access or approval. Runtime-variable verification requires the production host/project identity and read-only environment-settings access; Lovable sync verification requires read-only access to the connected Lovable workspace; canonical package-manager confirmation requires the production build configuration or deployment logs. PR #1's test/CI work remains unmerged and its lint job still fails on the pre-existing 1,606 Prettier errors and 10 warnings; resolving or merging it requires a narrow verified fix and maintainer review, not disabling lint or mass-formatting unrelated files. Keep Phase 1 and Android implementation deferred until the Phase 0 exit gate is met. Reassess these exact blockers on later runs without retrying unchanged inputs.



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
- **Remaining work / next priority (rechecked 8 November 2026):** PRs #3 and #6 already contain the source-backed privacy disclosures and pre-share confirmation, but remain draft and unverified; full project checks and interactive PR-preview verification are not available. Chronos copy/metadata corrections remain in PRs #4 and #8. The independent `/llms.txt` live/planned regression coverage is now submitted with PR #5. Keep Phase 0 host, Lovable and deployed-toolchain evidence open; this does not freeze independent Phase 1 work.


## 20. Execution log — 8 November 2026 — generated /llms.txt regression coverage

- Re-read `README.md`, `AGENTS.md`, `MASTER_PLAN.md` and `roadmap.md`; inspected current `main`, the open PR set, relevant source/tests, recent Actions and available deployment evidence. Current `main` is `39bb2084778c3db68a6f4864fedea2b3bab4ebe7`; the private repository is accessible through GitHub, but no local repository checkout or local working-tree status is exposed.
- Phase 0 candidate scan: production runtime-variable verification is blocked by the unidentified host/project and missing read-only settings access; Lovable sync is blocked because the correct SkyCo project is not accessible in the connected workspace; deployed package-manager confirmation is blocked by missing production build configuration/logs. Reproducible test/CI setup is still only on PR #1; its latest run passed frozen install, 29/29 tests and build but failed ESLint on the existing 1,606 Prettier errors and 10 warnings. No safe narrow lint-only fix was identified; broad formatting or weakening lint is not permitted.
- Phase 1 priority scan: the current live Float/privacy findings are addressed in source on PRs #3 and #6, but both remain drafts without project CI or an interactive PR preview; their review/acceptance verification is blocked, so no duplicate implementation was started. Chronos copy is already covered by PRs #4 and #8. The existing PR #5 planned-product wording was inspected and selected for the next independent task: regression coverage for the generated `/llms.txt` live/upcoming split and discovery fallback.
- Extracted the `/llms.txt` body builder and directory-fallback handling into `src/lib/llms-content.ts`; the route delegates to these helpers without changing its response content type, cache policy, navigation links or non-blocking discovery behavior. Added `src/lib/llms-content.test.ts` using the actual `fallbackDirectory` export.
- The six focused Node tests cover all five shipped products and first-party paths, both planned products and the absence of planned-product URLs, shared company/legal links, omission of an empty planned section, static fallback after discovery failure, and preference for a successful discovery snapshot.
- Verification: Node `v22.16.0` ran `node --experimental-strip-types --test src/lib/llms-content.test.ts` in an isolated temporary copy containing the fetched current `src/lib/projects.ts` and the exact new helper/test sources: **6 passed, 0 failed**. Node emitted its expected experimental TypeScript type-stripping warning. This is a focused test run, not a full repository checkout or package-script run. Bun, repository lint, production build and browser/runtime verification were not run; current `main` has no test script or general CI workflow.
- PR #5's branch was 5 commits ahead and 2 behind current `main`. The two intervening `main` commits changed only `MASTER_PLAN.md` and `roadmap.md` relative to the PR's merge base. Preserved published history by creating a two-parent merge commit with the existing PR #5 head as first parent and current `main` as second parent; the current `roadmap.md` and master plan were retained, and the planned-product status note plus this execution evidence were reconciled into the plan. No rebase, force-push, amend or squash was used.
- Updated the existing [PR #5](https://github.com/eboxont-code/skyco/pull/5); no duplicate PR was created. The PR remains open and unmerged. The planned-product checklist item remains unchecked pending review and runtime verification. No production route, data flow, DNS, hosting configuration, environment variable or deployment changed.
- **Next eligible task:** complete the remaining Phase 1 browser/accessibility verification only when an interactive preview is accessible. Until then, inspect for a specific independent source-backed defect rather than repeating existing PR work; uptime monitoring still requires an owner decision on probe scope, schedule, alert destination and retention.
