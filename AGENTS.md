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

- Product SoftwareApplication metadata uses the shared productAppScript helper so free access and publisher details stay consistent.
