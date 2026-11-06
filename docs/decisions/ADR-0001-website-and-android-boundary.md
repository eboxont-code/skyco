# ADR-0001: Preserve the SkyCo website and build a separate native Android client

- **Status:** Accepted
- **Date:** 7 November 2026
- **Decision scope:** Website and Android application boundary for the current SkyCo delivery
- **Authority:** `MASTER_PLAN.md` sections 0–2 and `AGENTS.md`

## Context

SkyCo already has a working website built with Vite, TanStack Start, React, TypeScript and Tailwind. It serves five shipped tools on first-party routes:

| Tool | Canonical route |
|---|---|
| CurrenSee | `/currensee` |
| Chronos | `/chronos` |
| My Finance Friend | `/finance-friend` |
| SkyCo Grocery Packs | `/grocery` |
| Float | `/float` |

The delivery plan calls for an Android application without replacing the existing website, creating five separate apps, or porting behaviour that has not first been verified against the website. Development and testing for this milestone must be possible on Windows; macOS and iOS are outside its scope.

## Decision

1. **Keep the existing website first-class.** Retain the Vite/TanStack Start application, its canonical `skyco.online/<product>` routes and its independent usefulness. Do not replace it with Flutter or redirect web visitors to an app.
2. **Build one separate native Flutter Android application.** Keep mobile source isolated under `apps/skyco_app/`. Use native Flutter UI, not a WebView wrapper. The app shell owns discovery, navigation, common settings, theme, help and app-level error handling.
3. **Organise the app as five independent feature modules:** CurrenSee, Chronos, My Finance Friend, SkyCo Grocery Packs and Float. Each module owns its domain rules, state and tests. Do not create five separately published apps or combine their private data into one shared model.
4. **Keep the first mobile milestone Android-only and Windows-buildable.** Do not require a Mac or begin iOS delivery in this milestone. Keep the design portable where practical without making iOS a release dependency.
5. **Share only verified contracts and product rules.** CurrenSee must receive a documented, versioned HTTP contract before Flutter depends on rate data. Do not guess the internal TanStack server-function transport or scrape website HTML. Chronos, Finance Friend, Grocery and Float remain local-first for their initial core jobs; do not add a backend solely for architectural symmetry.
6. **Preserve the privacy baseline.** No compulsory account, advertising, monetisation, bank connection, brokerage access, cloud sync or AI trade execution is introduced by this delivery. Do not send personal tool inputs to a server unless a specific transfer is necessary, disclosed and explicitly approved.

## Initial data boundaries

| Module | Initial Android approach |
|---|---|
| CurrenSee | Server-mediated public reference data, with source and freshness metadata and bounded caching |
| Chronos | Local calculation only after parity is proven; versioned reference fixtures |
| My Finance Friend | Local deterministic parser; session-only history by default |
| Grocery Packs | Bundled sample packs and local list state; offline-first |
| Float | Local-first private records; encrypted local persistence must be designed and tested before durable-save release; no automatic cloud sync |

These are delivery constraints, not a claim that the Android implementation already exists.

## Consequences

- The website and Android client can evolve independently while retaining consistent product rules and source-backed fixtures.
- Website routes, metadata, privacy disclosures and browser functionality remain release requirements after the app ships.
- Mobile work can begin incrementally under `apps/skyco_app/` without disturbing the web root or Lovable configuration.
- CurrenSee API design and parity fixtures are prerequisites to mobile integration, not reasons to expose internal server implementation details.
- Local-first modules require explicit storage, backup, sharing and data-loss decisions before any durable or cross-device feature is added.
- Android App Links are deferred until the domain association file and app manifest are validated; without the app, visitors must continue to reach the website.

## Explicitly deferred

This ADR does not select a Flutter SDK version, state-management package, routing package, database, encryption library, analytics provider, cloud-sync design or release vendor. Those choices require implementation evidence and, where they change privacy, cost or product promises, a separate decision. Current stable toolchain and store requirements must be checked when implementation or release begins.

## Acceptance checks

- [ ] Existing website and all five canonical product routes remain independently usable.
- [ ] Flutter source is isolated under `apps/skyco_app/`; no WebView-only replacement is used.
- [ ] One Android app contains five independently testable feature modules.
- [ ] Windows setup can build and test the Android client without macOS.
- [ ] CurrenSee mobile integration uses a documented, versioned, tested HTTP contract.
- [ ] Local-first and privacy boundaries above are implemented and tested before release.
- [ ] App Links, store metadata and release claims are validated before publication.

## References

- [Master plan](../../MASTER_PLAN.md)
- [Agent and repository constraints](../../AGENTS.md)
- [Flutter Android setup on Windows](https://docs.flutter.dev/platform-integration/android/setup)
- [Flutter architecture guidance](https://docs.flutter.dev/app-architecture/guide)
- [Flutter Android deployment](https://docs.flutter.dev/deployment/android)
