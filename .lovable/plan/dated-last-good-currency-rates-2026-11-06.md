# Dated last-good currency rates

- Retain each pair's last successful provider result, including its original date and source, in the existing bounded server cache.
- When refreshing fails, return that exact result with a stale flag. With no successful cached result, keep the unavailable state. Never manufacture a rate.
- Show a small “Last updated” date and “Not current” note for stale results, including the existing NRB-only pair flow.
- Test cache expiry, outages, pair isolation, invalid values and recovery. Check the notice at 390px, then tick the existing roadmap item and commit. Do not publish.

## Phase 1 batch

- Finish the rate-cache change, then reconcile Chronos registry, metadata, FAQs, support and machine-readable copy with its seven implemented systems. Preserve calendar caveats.
- Check existing behavior before changing privacy and security. Cover all five tools, optional local storage, provider requests, waitlist submissions, email-app support and hosting limitations accurately.
- Require explicit confirmation before creating or copying Float share links, with clear disclosure that the encoded figures are readable and not encrypted. Preserve sample sharing and Cancel.
- Confirm first-party shipped links and planned-only products. Update Bun installation guidance and add a 6 November changelog describing only verified changes.
- Run focused tests and lint; verify home, Chronos, Float, privacy and security at 390px first, then desktop. Tick only verified checklist items. Do not publish.

## Technical details

Keep the existing 60-second refresh interval and bounded, process-local cache. Preserve provider reference dates and fetched timestamps during fallback. Use a small injectable cache helper for deterministic tests; preserve NRB pair pages' direct published-rate source.