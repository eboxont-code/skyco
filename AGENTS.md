<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all shipped products on first-party `skyco.online/<product>` routes; this preserves one trusted hub and prevents duplicate product homes.
- Describe only behavior implemented by the current in-page experiences; this keeps privacy, security, status, and product claims verifiable.

- Keep product paths typed as the five shipped hub route literals so shared navigation uses type-safe TanStack links.
- Grocery check persistence uses versioned browser storage with per-pack keys and validation; lists must remain usable when storage is unavailable.

- Product data sources live in the project registry and drive trust pages to prevent duplicated provider claims.
- Product single-job descriptions live in the registry so machine-readable product listings stay consistent.
- Rate results use a bounded per-pair 60-second server cache to reduce repeated provider requests.
- Recent currency pairs use validated optional browser storage so unavailable storage never blocks conversion.
- Saved conversions preserve the displayed result and source metadata as bounded browser snapshots, never recomputed during refresh; this keeps historical records unchanged.
- Home-screen hints attach browser install listeners after mount and store only optional dismissal state; this avoids hydration changes and leaves unsupported browsers untouched.

- Product SoftwareApplication metadata uses the shared productAppScript helper so free access and publisher details stay consistent.
- Mount mobile actions only in ProductPage and derive them from its project, so home and unrelated tools never share a sticky action.

- Reuse an hourly Nepal Rastra Bank payload cache for supported rates; reject invalid values and label NPR peg fallback explicitly to avoid invented rates.
- Use one NRB day's unit-adjusted midpoints for both sides of NRB conversions so tables, history and converters agree.
- Compare related pairs by slug, not object identity, because loader data crosses serialization boundaries.
- Initialize pair converters with their loader rate and render deterministic update text until hydration to keep the first result stable.
- Keep additional NRB selector currencies in a browser-safe module and display buying, selling and unit data from the same loader row as the midpoint; this avoids backend changes and mismatched references.
- NPR pair page loaders consume getNprRates rows directly and never display peg-derived fallback rates, so their published reference matches the rates table.
- Waitlist submissions use a validated public server function with insert-only privileged access; visitors cannot read submission rows.
- The waitlist honeypot is checked only before client submission and is excluded from the stored payload, preserving the existing signup flow.
- Keep Start and router packages at a tested compatible release set and use the validator builder API, so security updates preserve existing rate and waitlist behavior.
- Keep Float planning pages in the un-nested `float_.$slug` route; this isolates their content and metadata from the main Float page.
- Guide FAQ arrays drive both visible answers and structured data so the two remain identical.
- Chronos parses selected dates at UTC noon, then constructs a local calendar date for the ported Nepali formatter so timezone offsets cannot change the selected day.
- Load monthly observance libraries only through a post-mount dynamic import; calendar downloads remain browser-only all-day events.
- Render Q&A presentation through QuestionAnswers while keeping route-owned structured data unchanged; shared semantics and hash opening stay consistent.
- Bundle responsive sizes of existing brand and product images and select them with srcSet; small screens should not download full-size previews.
- Chart periods filter existing provider points by calendar date without filling missing days, so every point remains source-backed.


## Branch, pull request and rollback conventions

- Keep `main` as the shared, Lovable-connected integration branch. Never force-push, rebase, amend or squash published commits.
- Use short-lived branches for code, security, dependency, test or multi-file changes. Name them `feat/<topic>`, `fix/<topic>`, `security/<topic>`, `test/<topic>`, `chore/<topic>` or `docs/<topic>`.
- Open a pull request into `main` for changes that affect application behaviour, privacy, security, dependencies, build/release configuration or multiple product files. Keep the change focused and include purpose, affected areas, verification results, known risks and rollback notes.
- A narrowly scoped documentation-only correction may be committed directly to `main` when it does not change product behaviour. Lovable-originated changes may continue to sync to the connected branch; inspect the resulting diff and run applicable checks.
- Do not assume branch protection, required reviews or automatic production deployment are configured. Verify those settings in the hosting/GitHub accounts before relying on them.
- Roll back published code with a new revert commit; never rewrite history. Prefer the hosting provider's previous-known-good deployment rollback for a bad release, then reconcile Git with a revert commit. Preserve user data and avoid destructive database rollback; use a forward fix unless a migration-specific recovery plan has been tested.
- Before any release, record the source commit, target environment, checks completed and recovery path. Do not claim a deployment or rollback until the provider confirms its outcome.


## Master plan and execution authority

- Read `MASTER_PLAN.md` before planning or implementing website-to-Android work. It is the current product scope, phased plan and acceptance checklist.
- `roadmap.md` remains the dated, historical web-work backlog. Do not duplicate completed entries or rewrite its history; add new execution tasks to the master plan or focused GitHub issues.
- `AGENTS.md` remains the immediate coding constraints document. If it conflicts with stale project notes, inspect the current registry and source, then update the stale note rather than reviving obsolete architecture.
- At the start of work, inspect the current branch/head, working tree, open PRs and relevant source files. Do not assume a previous audit remains current.
- Check a plan item only after its implementation and required tests/manual verification pass. Record the evidence in the commit, PR or test report.
- Keep the existing TanStack Start website and first-party `skyco.online/<product>` routes. The five shipped product paths are `/currensee`, `/chronos`, `/finance-friend`, `/grocery` and `/float`. Budget & Expenses and Daily Notes are planned, not shipped.
- The Android app is a separate Flutter client, not a WebView replacement. Current scope is Android built/tested from Windows; do not require macOS or start iOS work in this milestone.
- Keep mobile code isolated under the planned `apps/skyco_app/` directory so the existing Vite/TanStack web root and Lovable configuration remain intact.
- Do not expose or copy the tracked root `.env` contents into chat, prompts, issues, logs or commits. Treat the file as a P0 secret-audit item until a secret scan establishes whether it contains credentials. Use environment configuration and safe placeholder examples.
- Float currently persists guest data in browser local storage only after an explicit guest action. Its share payload is Base64 URL-safe encoded data, not encrypted. Do not describe it as encrypted or transmit it to a server without a reviewed design and explicit consent.
- Chronos currently displays seven systems, including Indian Saka, while some metadata/type/copy is stale. Use the current seven-system UI as the baseline and require golden-fixture parity before changing the calculation engine.
- Product privacy/security/status claims must match shipped code. Do not claim continuous uptime monitoring, secure encryption, background alerts, cloud sync or other capabilities until they are implemented and tested.
- CurrenSee's current `getRate` is a TanStack Start server function, not a documented public mobile REST contract. Do not guess its transport route or scrape HTML; implement and document a versioned HTTP adapter before Flutter depends on it.
- Preserve Lovable-connected Git history: never force-push or rewrite published commits. Keep the connected branch buildable and use small, reviewable commits.

- Float URL generation and clipboard/device sharing must run only from the explicit confirmation action in its existing alert dialog; cancellation must never expose a payload.
- Render runtime-dependent native calendar labels only after hydration so differing server/browser calendar support cannot change initial element structure.
