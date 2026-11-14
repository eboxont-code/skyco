# CurrenSee rate request and response path

**Source baseline:** `main` at [`633e7729`](https://github.com/eboxont-code/skyco/commit/633e7729d97046383b46860d29987f3d161e9fe4) (13 November 2026).

This document maps the existing website implementation. It is **not** a public API specification and does not define a new endpoint.

## Browser and route entry points

| Entry point | Current request path |
|---|---|
| `/currensee` converter | [`CurrenSeeConverter`](../../src/components/experiences/CurrenSeeConverter.tsx) wraps `getRate` with TanStack Start's `useServerFn` and calls it through TanStack Query using the selected `from` and `to` codes. The query has a 60-second stale time and a 120-second refetch interval. The page route validates optional pair query parameters against the exported currency allowlist. |
| Currency-pair page | [`currensee_.$pair.tsx`](../../src/routes/currensee_.$pair.tsx) loads the initial rate on the server. Non-NPR pairs use `getRate`; NPR pairs use `getNprRates` and build the displayed pair from the matching published NRB row. The resulting rate is passed to the converter as initial data. |
| NPR rates page | [`currensee_.rates.tsx`](../../src/routes/currensee_.rates.tsx) loads `getNprRates` on the server and renders the dated NRB rows or an unavailable message. |
| WebMCP rate tool | The converter's `get_currency_rate` tool calls the same `getRate` server function. It does not call a separate public HTTP API. |

The converter also has a dedicated client-side NRB lookup branch when both its initial pair and current selection are NPR pairs. Other selections use `getRate`. The dedicated pair-page/rates-page NRB path returns unavailable when there is no published NRB row; it does not apply the INR peg fallback described below.

## Server-function boundary

[`src/lib/rates.functions.ts`](../../src/lib/rates.functions.ts) exports two TanStack Start GET server functions:

- **`getRate({ from, to })`** uppercases both codes and rejects anything outside `CURRENCIES`. Its result type is `RateResult`: pair codes, numeric rate, source, provider reference date (`asOf`), server fetch time (`fetchedAt`), dated history points, approximation state and optional NRB/stale flags. The browser-safe currency allowlist and result type live in [`rates.shared.ts`](../../src/lib/rates.shared.ts); the handler dynamically imports the server-only [`rate-provider.server.ts`](../../src/lib/rate-provider.server.ts).
- **`getNprRates()`** returns the latest published NRB date, normalized rows (buy, sell, unit, midpoint and per-one-unit value), and a fallback flag. It returns `null` when no usable NRB data can be loaded.

The provider module accepts an injected HTTP request function, NRB loader and clock for deterministic tests; production defaults remain the existing fetch, NRB loader and system clock. The provider selection, rate formulas, URLs, source labels and cache policy are unchanged.

These are framework-managed server functions. The repository does not document a stable public REST path or versioned mobile contract for them. Do not guess an internal transport URL or make a Flutter client depend on one. The versioned HTTP contract remains a separate Phase 2 task.

## Provider selection and conversion

All third-party requests are made from the server-side rate implementation, not from mobile/browser code.

### Fiat rates

- Ordinary fiat pairs use [Frankfurter v1](https://api.frankfurter.dev/v1). The latest request uses USD as the base and asks for the supported symbols; the response is inverted into USD-per-currency values.
- Fiat history requests use the selected pair and an open-ended date range beginning 30 calendar days before the request. Only positive points actually returned by Frankfurter are kept and sorted by date. Missing weekends/holidays are not filled.
- The pure `parseFrankfurterLatest` helper validates the dated USD-base payload and converts positive currency values to USD per unit. `parseFrankfurterHistory` keeps only positive points returned for the requested target and never fills missing dates.
- The URL builders and response parsers are isolated in [`frankfurter.ts`](../../src/lib/frankfurter.ts).

### Crypto rates

- Spot prices use CoinGecko's `simple/price` endpoint with USD values.
- History uses CoinGecko's 30-day `market_chart` endpoint. Cross-currency history is converted through USD and marked approximate when the other side is not USD.

### Nepal Rastra Bank rates

- NPR, QAR, AED and SAR cause `getRate` to load the NRB feed through [`nrb-rates.server.ts`](../../src/lib/nrb-rates.server.ts).
- The loader first requests the recent published date range, then tries the latest-feed endpoint if that request fails. It validates dated rows and positive buy/sell/unit values, retains a newer last-good payload if a refresh returns older data or fails, and labels fallback data.
- The normal NRB payload cache lasts one hour; a fallback payload is refreshed after 60 seconds.
- NRB buy/sell values are averaged and divided by the published currency unit before conversion through USD.
- If NRB is unavailable, `getRate` does not derive QAR/AED/SAR. For an NPR pair that can use the `getRate` path, it may derive NPR from INR using the official 1.6 peg and reports the source as **Derived from INR at the official 1.6 peg**. The dedicated `getNprRates` route path does not make that substitution.

## Caching, freshness and failure behaviour

- `getRate` uses [`rate-cache.ts`](../../src/lib/rate-cache.ts), keyed by the exact ordered currency pair and bounded to the square of the supported-currency count.
- A successful pair result is cached for 60 seconds. If an expired entry cannot be refreshed, the exact previous result is returned with `stale: true`; a cold-cache failure is rejected rather than inventing a rate or borrowing another pair's value.
- The converter considers a result stale when the server marks it stale, the NRB fallback flag is set, or the query has an error while retaining data. It displays the provider date and an explicit stale message.
- A history request that is unavailable yields an empty series; the current rate can still be returned. A failed current-rate lookup is not converted into a fabricated value.

## Existing focused test coverage

The current tree contains focused tests for:

- [`frankfurter.test.ts`](../../src/lib/frankfurter.test.ts): explicit v1 endpoints, USD-base cross-rate normalization, missing/invalid latest values, malformed latest payloads and empty/sparse history (9 tests).
- [`nrb-rates.server.test.ts`](../../src/lib/nrb-rates.server.test.ts): dated/latest-feed fallback, last-good retention, invalid/missing rows, supported pair-directory currencies and units, cold outage, timeout, HTTP 429 and malformed JSON (10 tests).
- [`rate-cache.test.ts`](../../src/lib/rate-cache.test.ts): fresh cache, cold outage, stale fallback, pair isolation, invalid results, recovery and bounded eviction (7 tests).
- [`rate-provider.server.test.ts`](../../src/lib/rate-provider.server.test.ts): full provider-path fixtures for Frankfurter, CoinGecko and NRB, including the NPR peg fallback, required-source failure, history outage and stale-cache recovery (7 tests).

Together these four focused files contain 33 tests. The provider-path suite exercises the exact provider core called by `getRate`; it does not invoke TanStack's HTTP transport or create a public endpoint. The versioned HTTP contract remains a separate Phase 2 task.

## What this mapping does not establish

- It does not establish live provider availability, latency or uptime monitoring.
- It does not create a public endpoint, change provider requests, change cache policy or add a mobile dependency.
- It does not verify production runtime variables or Supabase configuration.
- It does not replace deterministic cross-provider fixtures or the future versioned API contract.

The next API task must define a stable request/response schema, explicit error model, freshness semantics, caching/rate limits and examples without exposing provider credentials or private server-function transport details.
