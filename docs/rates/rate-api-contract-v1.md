# CurrenSee rate HTTP contract v1

**Status:** proposed contract, documented 16 November 2026. **The `/api/v1/rates` route does not exist today.** The website continues to use the TanStack Start `getRate` server function. This document and its JSON Schema do not expose an endpoint or authorize Flutter to scrape HTML or guess framework transport URLs.

The source of truth for current provider behaviour is [currensee-request-path.md](currensee-request-path.md), `src/lib/rate-provider.server.ts`, and `src/lib/rate-provider.server.test.ts` at commit `aa8ee1c`. The machine-checkable schema is [rate-api-contract-v1.schema.json](rate-api-contract-v1.schema.json).

## Base path and request

Proposed request:

```text
GET /api/v1/rates?from=AUD&to=EUR&amount=100&history=30d
Accept: application/json
```

| Parameter | Required | Rules                                                                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `from`    | yes      | One supported three-letter currency code from `CURRENCIES` in `src/lib/rates.shared.ts`; uppercase it before validation.                                     |
| `to`      | yes      | Same allowlist and normalization as `from`. The ordered pair matters.                                                                                        |
| `amount`  | no       | A finite JSON number greater than zero after parsing. Default: `1`. The response echoes the parsed number and multiplies it by `rate` for `convertedAmount`. |
| `history` | no       | `7d` or `30d`. Default: `30d`. Return only source-backed points in the requested calendar window; never fill missing days.                                   |

The current website sends only `from` and `to` to its rate function and multiplies the amount in the browser. A Flutter client should also omit `amount` and multiply locally unless a separate product and privacy decision approves sending that value. No provider credential, user account, alert threshold, or Float record belongs in this request.

## Successful response

HTTP `200 OK`, `Content-Type: application/json`.

| Field                  | JSON type | Meaning and current-provider mapping                                                                                           |
| ---------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `data.from`, `data.to` | string    | Normalized ordered pair.                                                                                                       |
| `data.amount`          | number    | Parsed amount, or `1` when omitted.                                                                                            |
| `data.rate`            | number    | Positive units of `to` for one unit of `from`; current `RateResult.rate`.                                                      |
| `data.convertedAmount` | number    | `amount * rate`.                                                                                                               |
| `data.source`          | string    | Exact provider classification: `Frankfurter`, `CoinGecko`, `Nepal Rastra Bank`, or `Derived from INR at the official 1.6 peg`. |
| `data.referenceDate`   | string    | Provider reference date in `YYYY-MM-DD`; current `RateResult.asOf`.                                                            |
| `data.fetchedAt`       | string    | Server fetch time as an ISO 8601 UTC timestamp; current `RateResult.fetchedAt`. A stale result keeps its original timestamp.   |
| `data.stale`           | boolean   | `true` only for a retained last-good result or current NRB fallback state; missing current flags map to `false`.               |
| `data.approximate`     | boolean   | Current `RateResult.approximate`, used for converted crypto cross-currency history.                                            |
| `data.fallback`        | boolean   | `true` when `nrbFallback` is set or the official INR 1.6 peg is used; otherwise `false`.                                       |
| `data.attribution`     | string    | Human-readable attribution. In v1 it is exactly the same string as `source`.                                                   |
| `data.historyStatus`   | string    | `available` when at least one source-backed point is returned; otherwise `unavailable`.                                        |
| `data.history`         | array     | Zero or more `{ "date": "YYYY-MM-DD", "rate": number }` points, mapped from current `series` and its `value` field.            |
| `data.warnings`        | array     | Optional partial-success warnings using the same object shape as an error. `HISTORY_UNAVAILABLE` is the only v1 warning.       |

A reference rate is not an executable cash, card, bank, remittance, or crypto-trading quote.

### Fresh fiat example

```json
{
  "data": {
    "from": "AUD",
    "to": "EUR",
    "amount": 100,
    "rate": 0.5,
    "convertedAmount": 50,
    "source": "Frankfurter",
    "referenceDate": "2026-11-12",
    "fetchedAt": "2026-11-13T12:00:00.000Z",
    "stale": false,
    "approximate": false,
    "fallback": false,
    "attribution": "Frankfurter",
    "historyStatus": "available",
    "history": [
      { "date": "2026-11-10", "rate": 0.5 },
      { "date": "2026-11-11", "rate": 0.55 }
    ]
  }
}
```

### Stale last-good example

The rate, reference date, and original fetch time remain unchanged. Only freshness state changes.

```json
{
  "data": {
    "from": "AUD",
    "to": "EUR",
    "amount": 1,
    "rate": 0.5,
    "convertedAmount": 0.5,
    "source": "Frankfurter",
    "referenceDate": "2026-11-12",
    "fetchedAt": "2026-11-13T12:00:00.000Z",
    "stale": true,
    "approximate": false,
    "fallback": false,
    "attribution": "Frankfurter",
    "historyStatus": "available",
    "history": [{ "date": "2026-11-11", "rate": 0.5 }]
  }
}
```

### Approximate crypto cross-rate example

```json
{
  "data": {
    "from": "BTC",
    "to": "AUD",
    "amount": 0.25,
    "rate": 96000,
    "convertedAmount": 24000,
    "source": "CoinGecko",
    "referenceDate": "2026-11-13",
    "fetchedAt": "2026-11-13T12:00:00.000Z",
    "stale": false,
    "approximate": true,
    "fallback": false,
    "attribution": "CoinGecko",
    "historyStatus": "available",
    "history": [{ "date": "2026-11-11", "rate": 88000 }]
  }
}
```

### NRB latest-published fallback example

```json
{
  "data": {
    "from": "AUD",
    "to": "NPR",
    "amount": 1,
    "rate": 86,
    "convertedAmount": 86,
    "source": "Nepal Rastra Bank",
    "referenceDate": "2026-11-12",
    "fetchedAt": "2026-11-13T12:00:00.000Z",
    "stale": true,
    "approximate": false,
    "fallback": true,
    "attribution": "Nepal Rastra Bank",
    "historyStatus": "available",
    "history": [{ "date": "2026-11-12", "rate": 86 }]
  }
}
```

### Official INR peg fallback example

This fallback is allowed only for an NPR pair on the general `getRate` path. It is not used for QAR, AED, SAR, or the dedicated NRB table/pair loaders.

```json
{
  "data": {
    "from": "AUD",
    "to": "NPR",
    "amount": 1,
    "rate": 80,
    "convertedAmount": 80,
    "source": "Derived from INR at the official 1.6 peg",
    "referenceDate": "2026-11-12",
    "fetchedAt": "2026-11-13T12:00:00.000Z",
    "stale": false,
    "approximate": false,
    "fallback": true,
    "attribution": "Derived from INR at the official 1.6 peg",
    "historyStatus": "unavailable",
    "history": [],
    "warnings": [
      {
        "code": "HISTORY_UNAVAILABLE",
        "message": "The current rate is available, but source-backed history is unavailable.",
        "retryable": true
      }
    ]
  }
}
```

## Error and warning envelope

Fatal errors use HTTP `Content-Type: application/json` and this shape. Do not include upstream response bodies, stack traces, secrets, or a fabricated rate.

```json
{
  "error": {
    "code": "UNSUPPORTED_PAIR",
    "message": "Choose two supported currency codes.",
    "retryable": false
  }
}
```

| Code                         | HTTP status               | Required meaning                                                                                                                                   |
| ---------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNSUPPORTED_PAIR`           | `400 Bad Request`         | A missing, malformed, or non-allowlisted `from`/`to`, including an unsupported ordered pair.                                                       |
| `PROVIDER_TIMEOUT`           | `504 Gateway Timeout`     | The required provider exceeded the adapter's bounded timeout and no valid last-good rate exists.                                                   |
| `RATE_LIMITED`               | `429 Too Many Requests`   | The caller or required provider is rate limited. Include `Retry-After` only when a real retry interval is known.                                   |
| `MALFORMED_UPSTREAM_PAYLOAD` | `502 Bad Gateway`         | The provider response cannot be validated and no valid last-good rate exists.                                                                      |
| `NRB_UNAVAILABLE`            | `503 Service Unavailable` | Required NRB data is unavailable, including QAR/AED/SAR with no usable published or cached NRB row.                                                |
| `HISTORY_UNAVAILABLE`        | `200 OK` warning          | The current rate is valid but history is empty because it could not be retrieved. Put the object in `data.warnings`; do not fail the current rate. |

The existing provider core often throws the generic `Reference rates unavailable` error. The future HTTP adapter must classify failures at the provider boundary to implement these codes; this document does not claim the current server function already returns them.

### Provider timeout example

```json
{
  "error": {
    "code": "PROVIDER_TIMEOUT",
    "message": "The rate provider timed out. Try again shortly.",
    "retryable": true
  }
}
```

### Rate-limited example

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate requests are temporarily limited. Try again later.",
    "retryable": true
  }
}
```

### Malformed upstream payload example

```json
{
  "error": {
    "code": "MALFORMED_UPSTREAM_PAYLOAD",
    "message": "The rate provider returned data that could not be validated.",
    "retryable": true
  }
}
```

### Required NRB unavailable example

```json
{
  "error": {
    "code": "NRB_UNAVAILABLE",
    "message": "Nepal Rastra Bank reference rates are unavailable for this pair.",
    "retryable": true
  }
}
```

### History unavailable partial-success example

Use the official INR peg example above: HTTP `200`, a valid current `data.rate`, `historyStatus: "unavailable"`, an empty `history` array, and a `HISTORY_UNAVAILABLE` warning.

## Freshness behaviour and exact website labels

### Implemented thresholds

- `src/lib/rate-cache.ts` keeps each ordered pair's last-good result for **60,000 ms**. The cache is bounded by the square of the supported-currency count. An expired-entry refresh failure returns the exact prior rate, source, `referenceDate`, and `fetchedAt` with `stale: true`. A cold-cache failure returns no rate.
- `src/lib/nrb-rates.server.ts` caches a normal NRB payload for **3,600,000 ms (one hour)**. A fallback payload retries after **60,000 ms**. A failed refresh retains the last valid published payload and its actual dates. A cold outage with no published data fails closed.
- `src/components/experiences/CurrenSeeConverter.tsx` gives its browser query a 60-second stale time and a 120-second refetch interval. Its dedicated browser-side NPR pair cache also uses the shared 60-second pair cache.

### Exact labels copied from current UI

| State                              | Exact user-facing string or template                                                                                                                  | Source                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Initial server-rendered fresh rate | `Reference rate for {referenceDate}`                                                                                                                  | `CurrenSeeConverter.tsx`                            |
| Fresh after hydration              | `Checked less than a minute ago`; later `Checked {n} minute ago`, `Checked {n} minutes ago`, `Checked {n} hour ago`, or `Checked {n} hours ago`       | `CurrenSeeConverter.tsx`, `timeAgo`                 |
| Refreshing                         | `Refreshing rate`                                                                                                                                     | `CurrenSeeConverter.tsx`                            |
| Stale summary                      | `Stale: last available rate`                                                                                                                          | `CurrenSeeConverter.tsx`                            |
| Stale detail                       | `Stale rate. Last updated: {referenceDate}. I could not confirm a newer rate.`                                                                        | `CurrenSeeConverter.tsx` and `currensee_.$pair.tsx` |
| Approximate crypto history         | `Converted through USD. `                                                                                                                             | `CurrenSeeConverter.tsx`                            |
| NRB latest-published fallback      | `Latest available published NRB rates. These are not confirmed as today's rates.`                                                                     | Converter, pair page, and NRB rates page            |
| Unavailable summary                | `Rate service unavailable`                                                                                                                            | `CurrenSeeConverter.tsx`                            |
| Unavailable converted amount       | `Unavailable`                                                                                                                                         | `CurrenSeeConverter.tsx`                            |
| Provider error with no cached data | `I could not reach the rate service just now. No previously retrieved rate is available for this pair.`                                               | `CurrenSeeConverter.tsx`                            |
| Provider-error action              | `Try again`                                                                                                                                           | `CurrenSeeConverter.tsx`                            |
| Pair-page unavailable              | `Today's reference rate is unavailable. For NPR pairs, I only show a currency when it appears in the Nepal Rastra Bank feed. Please try again later.` | `currensee_.$pair.tsx`                              |
| NRB-table unavailable              | `Nepal Rastra Bank rates are unavailable right now. Please try again in a few minutes.`                                                               | `currensee_.rates.tsx`                              |
| History unavailable                | `No history available for this pair.`                                                                                                                 | `CurrenSeeConverter.tsx`                            |

All required states already have explicit labels, so no visual label was added in this batch. `src/lib/rate-freshness-labels.test.ts` locks these exact strings to the current source.

## Versioning and deprecation

- The version is in the base path. Additive optional response fields may be introduced within v1; clients must ignore unknown additive fields.
- Removing or renaming a field, changing its meaning/type, tightening accepted values incompatibly, or changing error semantics requires `/api/v2/rates`.
- Once a replacement version is available, announce a v1 deprecation at least 90 days before removal. During deprecation, responses should carry standard `Deprecation` and `Sunset` headers with real dates. Do not remove v1 while a supported SkyCo Android release still requires it.
- The schema file is normative for v1 field names and types. Examples are deterministic fixtures, not live market rates.

## Standing constraints

- **Server-side third-party fetches; no secrets in mobile:** provider hosts appear in `src/lib/rate-provider.server.ts`, `src/lib/frankfurter.ts`, and `src/lib/nrb-rates.server.ts`. `src/lib/rates.functions.ts` dynamically imports the server provider. `src/components/experiences/CurrenSeeConverter.tsx` contains no provider hostnames. Covered by `rate-api-contract.test.ts` test `standing constraints keep provider hosts server-side and preserve cache TTL constants`; no Flutter source exists to hold secrets.
- **Frankfurter/CoinGecko/NRB attribution and NRB fallback:** exact source strings and the peg source are asserted in `rate-provider.server.test.ts` tests `Frankfurter provider path returns a dated fiat cross-rate and only published history points`, `CoinGecko provider path converts crypto to fiat and marks cross-currency history approximate`, `NRB provider path applies published units and buy/sell midpoint to the pair and history`, and `NPR falls back to the official INR 1.6 peg only when NRB is unavailable`. `QAR fails closed when the required NRB source is unavailable` prevents unsupported substitution. Contract mapping tests assert `attribution === source`.
- **60-second pair cache:** `rate-cache.test.ts` tests `fresh pair snapshots carry the provider date and false stale flag without refetching before expiry`, `60-second cache expiry retains the exact last good pair rate, date and source with a stale flag`, and `successful recovery replaces the stale rate and clears the stale flag`.
- **Hourly NRB payload cache and fallback:** `nrb-rates.server.test.ts` tests `expired cache survives a complete provider outage without changing its date or values`, `failed range fetch falls back to the latest published dated feed`, and `an older latest-feed response cannot replace a newer cached NRB day`.
- **Deterministic provider fixtures:** `rate-provider.server.test.ts`, `frankfurter.test.ts`, `nrb-rates.server.test.ts`, and `rate-cache.test.ts` use synthetic transport data and no live network. `rate-api-contract.test.ts` maps their representative outputs onto the v1 schema and validates every error code.

## Verification

Run `bun run test`. The contract tests use injected mocked `fetch`/NRB loaders only. They do not call the live providers, start an HTTP server, or expose `/api/v1/rates`.
