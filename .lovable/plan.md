# Dated last-good currency rates

- Retain each pair's last successful provider result, including its original date and source, in the existing bounded server cache.
- When refreshing fails, return that exact result with a stale flag. With no successful cached result, keep the unavailable state. Never manufacture a rate.
- Show a small “Last updated” date and “Not current” note for stale results, including the existing NRB-only pair flow.
- Test cache expiry, outages, pair isolation, invalid values and recovery. Check the notice at 390px, then tick the existing roadmap item and commit. Do not publish.

## Technical details

Keep the existing 60-second refresh interval and bounded, process-local cache. Preserve provider reference dates and fetched timestamps during fallback. Use a small injectable cache helper for deterministic tests; preserve NRB pair pages' direct published-rate source.