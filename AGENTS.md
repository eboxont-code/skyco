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

- Keep product paths typed as the four hub route literals so shared navigation uses type-safe TanStack links.
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
- Keep Start and router packages at a tested compatible release set and use the validator builder API, so security updates preserve existing rate and waitlist behavior.
- Keep Float planning pages in the un-nested `float_.$slug` route; this isolates their content and metadata from the main Float page.
- Guide FAQ arrays drive both visible answers and structured data so the two remain identical.
- Chronos parses selected dates at UTC noon, then constructs a local calendar date for the ported Nepali formatter so timezone offsets cannot change the selected day.
- Load monthly observance libraries only through a post-mount dynamic import; calendar downloads remain browser-only all-day events.
- Render Q&A presentation through QuestionAnswers while keeping route-owned structured data unchanged; shared semantics and hash opening stay consistent.
- Bundle responsive sizes of existing brand and product images and select them with srcSet; small screens should not download full-size previews.
