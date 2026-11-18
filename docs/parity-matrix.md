# SkyCo website, service and Android parity matrix

**Baseline: 18 November 2026.** Only the five shipped website products are covered. Android is not built; its source scaffold has not compiled or run. Exact fixture outputs, including labels, dates, nulls, empty lists and errors, are the acceptance baseline, not independently certified financial or astronomical truth.

Fixture references below are repository paths, not new endpoints. Named cases identify exact test/JSON records. CurrenSee uses deterministic inline TS transport fixtures. The mobile field mapping is documented in [rate-api-contract-v1.md](rates/rate-api-contract-v1.md) and [rate-api-contract-v1.schema.json](rates/rate-api-contract-v1.schema.json), and validated without live network by `src/lib/rate-api-contract.test.ts`. **`GET /api/v1/rates` is implemented in source and covered by mocked schema tests; production availability is not verified in this batch.** The website still uses its existing server function. Exact website freshness labels are locked by `src/lib/rate-freshness-labels.test.ts`.

## CurrenSee (`/currensee`)

| Behaviour | Website expected output and exact fixture/case | Service/API expected output | Android expected output |
| --- | --- | --- | --- |
| Frankfurter v1 request contract | `src/lib/frankfurter.test.ts`, `Frankfurter uses the explicit v1 API on api.frankfurter.dev`, latest USD-base request and directional history request cases | Existing website server path consumes Frankfurter v1; the versioned public adapter reuses the same provider path | not built yet — must match fixture |
| Fiat cross rates and provider date | `src/lib/frankfurter.test.ts`, `latest USD-base values support cross rates for common fiat pairs`: date 2026-11-05, AUD reciprocal 0.625, AUD/CAD 0.78125 from synthetic input; full AUD/EUR provider output is covered by `src/lib/rate-provider.server.test.ts` and mapped to v1 by `src/lib/rate-api-contract.test.ts` | Implemented v1 preserves parser values, reference date, attribution and source-backed history in mocked route tests | not built yet — must match fixture |
| Missing/invalid rates and malformed latest payload | `src/lib/frankfurter.test.ts`, `latest payload omits missing, invalid and unsupported rate values` retains only USD/AUD; `malformed latest payloads fail closed` throws unavailable | Never manufacture a missing provider rate | not built yet — must match fixture |
| Empty/sparse history | `src/lib/frankfurter.test.ts`, `empty Frankfurter history stays empty without filling missing days` returns []; `history keeps only positive requested-pair values in date order` returns only 2026-11-03 and 2026-11-05 | Empty remains empty; missing days are not interpolated | not built yet — must match fixture |
| NRB supported currencies and units | `src/lib/nrb-rates.server.test.ts`, `all published NRB currencies used by the pair directory retain their provider units` covers all 19 currencies, INR/JPY/KRW unit 100; invalid-row case omits unusable rows. Full AUD/NPR midpoint output is covered by `src/lib/rate-provider.server.test.ts` and mapped to v1 by `src/lib/rate-api-contract.test.ts` | Implemented v1 preserves the published-unit midpoint, actual reference date, NRB attribution and fallback state in mocked route tests | not built yet — must match fixture |
| NRB latest published fallback, outage, timeout, 429 and malformed JSON | `src/lib/nrb-rates.server.test.ts`, failed-range and 429 cases retain published date 2026-11-04 with fallback true; expired-cache case preserves dated rows; cold-cache/timeout/malformed cases reject with reference rates unavailable | Preserve actual published date, fallback indicator and last good rows; no invented cold-cache result | not built yet — must match fixture |
| Last good pair snapshot and recovery | `src/lib/rate-cache.test.ts`, fresh snapshot, 60-second expiry, cold outage, invalid replacement, recovery and bounded-cache cases: fresh stale=false; outage retains exact pair/date/source with stale=true; cold outage rejects | Same pair-specific 60-second cache rules; tests use synthetic rates only | not built yet — must match fixture |
| CoinGecko conversion/source attribution; full getRate integration | `src/lib/rate-provider.server.test.ts`, `CoinGecko provider path converts crypto to fiat and marks cross-currency history approximate`: BTC/AUD 96000, source CoinGecko, approximate history points 80000/88000 from synthetic input; `src/lib/rate-api-contract.test.ts` maps this output to the v1 schema | Implemented v1 preserves source, reference date, approximate flag, attribution and history in contract tests | not built yet — must match fixture |
| Amount/swap, chart periods, saved snapshots, alerts and recent/favourite pairs | Local website controls surround provider results; the current golden rate cases do not certify every UI/state workflow. Save the displayed dated snapshot, never recalculate history; alert checks require the open page | Browser-local state/control behaviour, no mobile API for these features | not built yet — must match fixture |

## Chronos (`/chronos`)

| Behaviour | Website expected output and exact fixture/case | Service/API expected output | Android expected output |
| --- | --- | --- | --- |
| All seven readings, in order | `src/lib/__fixtures__/chronos/readings.json`, every `cases` record includes Gregorian, Nepali Bikram Sambat, Hijri, Hebrew, Chinese, Persian and Indian Saka | website-only/local, no API | not built yet — must match fixture |
| Gregorian leap and month/year boundaries | Same file, dates 2000-02-28/29, 2000-03-01, 2023-02-28/2023-03-01, 2024-02-29/2024-03-01, 2026-12-31/2027-01-01; compare exact seven-reading records | website-only/local, no API | not built yet — must match fixture |
| Hebrew/Persian leap and new-year boundaries | Same file, 2024-03-10/11 (Adar I/II), 2021-03-20/21 (leap Esfand/new year), 2024-03-19/20 | website-only/local, no API | not built yet — must match fixture |
| Nepali and Chinese year boundaries | Same file, 2024-04-12/13 and 2024-02-09/10 | website-only/local, no API | not built yet — must match fixture |
| UTC-noon selection near local midnight | Same file, four `boundaries` records in Asia/Kathmandu (+05:45) and Pacific/Honolulu (-10:00); selectedDate readings match the corresponding golden case regardless of local day | website-only/local, no API | not built yet — must match fixture |
| Date navigation/copy links, age and observances | Local website controls; reading fixtures above cover the selected day's readings, not full navigation/clipboard, age or observance export contracts | website-only/local, no API | not built yet — must match fixture |

**Known platform difference:** Indian Saka and other native calendar labels depend on browser/runtime `Intl`. Golden readings record the current Bun/Intl baseline, not guaranteed Android output. Android calendar/runtime support and matching labels are not verified. Nepali reading conversion preserves selected UTC-noon calendar days; do not substitute a local-midnight parse.

## Grocery Packs (`/grocery`)

| Behaviour | Website expected output and exact fixture/case | Service/API expected output | Android expected output |
| --- | --- | --- | --- |
| Both shipped packs and household scaling | `src/lib/__fixtures__/grocery/packs.json`, `sizes` 1, 2, 4, 6: Easy Week and Meat Free Week; exact sections, item order and quantity strings retained | website-only/local, no API | not built yet — must match fixture |
| Validate checked keys, drop duplicates/unknown values | Same file, `storage` record with duplicate Onions, numeric/other-pack/unknown entries restores only easy-week:Onions | website-only/local, no API | not built yet — must match fixture |
| Restore packs independently | Same file, malformed easy-week `[` plus valid meat-free Eggs record restores Eggs; malformed legacy plus valid version-2 record also restores Eggs | website-only/local, no API | not built yet — must match fixture |
| Schema version 2 and safe migration | `src/lib/grocery-fixtures.test.ts`, `Grocery legacy v1 data migrates to isolated per-pack keys and round trips` and `Grocery unversioned arrays migrate without losing valid checked items`: `{version:2,checked:[...]}` per pack | website-only/local, no API; delete legacy only after all pack writes succeed | not built yet — must match fixture |
| Reject unsupported schema/invalid shape | `src/lib/__fixtures__/grocery/packs.json`, `storage` version 99, wrong-shape/null, malformed JSON and legacy-array records restore no invalid keys | website-only/local, no API | not built yet — must match fixture |
| Storage unavailable | `src/lib/grocery-fixtures.test.ts`, `Grocery remains usable when storage reads and writes throw`: no throw; in-memory checked Onions remains usable and quantities unchanged | website-only/local, no API | not built yet — must match fixture |
| Tick/reset/hide, copy/share/print and household preference | Browser controls use the same ordered quantity and checked-key data above; clipboard/device sharing/printing are platform operations, not independently covered by the golden JSON | website-only/local, no API | not built yet — must match fixture |

## My Finance Friend (`/finance-friend`)

| Behaviour | Website expected output and exact fixture/case | Service/API expected output | Android expected output |
| --- | --- | --- | --- |
| Valid deterministic trades | `src/lib/__fixtures__/finance/parser.json`, valid bought 50 NVDA (Buy, 50, 145, Today), sold 10 AAPL (Sell, 10, 212.4, Yesterday), decimal VOO and buy 2024 shares NVDA cases | website-only/local, no API | not built yet — must match fixture |
| Multiple trades/actions/tickers/quantities or conflicting days | Same file, all `ambiguous` records: `{status:"ambiguous",message:"This line is ambiguous. Enter one trade with one action, quantity, ticker and date, then check it again."}`; no trade selected or saved | website-only/local, no API; deterministic regex parsing, no AI | not built yet — must match fixture |
| Malformed/missing action/zero quantity | Same file, `malformed` empty input, hold ten shares, buy 0 cases return null | website-only/local, no API | not built yet — must match fixture |
| Missing/unreadable price | Same file, `missing-price` VOO and AAPL cases retain price=null; value not calculated | website-only/local, no API | not built yet — must match fixture |
| Defaulted date | Same file, `missing-date` added VOO and explicit ISO-date MSFT cases currently report `Today (assumed)`; explicit ISO dates are not interpreted by this parser | website-only/local, no API | not built yet — must match fixture |
| Session holdings total and missing price | `src/components/experiences/FinanceParser.test.ts`, `saved total sums quantity times price without assigning a missing price`: total 9374; empty total 0 | website-only/local, no API | not built yet — must match fixture |
| CSV, remove/clear and session lifetime | Current website-only controls; JSON parser fixtures cover trade content, not clipboard formatting/confirmation contracts. Session holdings do not persist after leaving | website-only/local, no API | not built yet — must match fixture |

**Fixture correction:** `buy 2024 shares of NVDA at 10` has one action, quantity and ticker, so it is valid, not ambiguous. It retains its former exact output; only its category was corrected.

## Float (`/float`)

| Behaviour | Website expected output and exact fixture/case | Service/API expected output | Android expected output |
| --- | --- | --- | --- |
| Weekly/fortnightly boundaries | `src/lib/__fixtures__/float/planning.json`, `recurrence`: weekly inclusive boundaries (Nov 9/16/23), fortnightly across year boundary (Dec 28/Jan 11/25), future weekly [], reversed bounds [], single-day inclusion | website-only/local, no API | not built yet — must match fixture |
| Monthly clamping without drifting anchor day | Same file, monthly 31st common February, leap February, April, March cases: Feb 28/29, Apr 30, Mar 31 | website-only/local, no API | not built yet — must match fixture |
| Never recur before anchor | Same file, future December 31 monthly, future January 31, future leap February cases all [] | website-only/local, no API | not built yet — must match fixture |
| Invalid/impossible date rejection | Same file, invalid monthly, empty weekly, invalid calendar day and impossible 2026-02-30/2026-13-01 recurrence cases []; `src/lib/float-fixtures.test.ts` date-helper cases return invalid Date / "Invalid date" / null rather than normalize | website-only/local, no API | not built yet — must match fixture |
| Period totals, negative balance, empty inputs | Same file, `planning`: negative balance -75, empty inputs totals 0, fortnight totals spendable 300, leap February spendable 800, invalid date no rows | website-only/local, no API | not built yet — must match fixture |
| Required form validation | Same file, `form`: empty name/amount, missing/impossible dates, negative/zero/NaN/malformed/numeric-prefix amounts reject (expected null); errors state the required correction. Rounded valid amount remains 12.35 | website-only/local, no API; linked inline errors prevent submission | not built yet — must match fixture |
| Optional deal fields | Same file, negative original price and invalid deal date cases reject with their field errors; omitted optional values remain null | website-only/local, no API | not built yet — must match fixture |
| Share payload and malformed links | `src/lib/float-share.test.ts`, disclosed-fields round trip, readable Base64 and malformed/unusable links cases: preserve all three buckets; readable tuple encoding; invalid/empty payload returns null | website-only/local, no API; Base64 URL-safe encoding is not encryption | not built yet — must match fixture |
| Share consent and cancellation | `src/components/float/FloatPlanner.test.ts`, share generation only through Continue; `src/lib/float-planner.test.ts`, reopen clears feedback. Cancellation never creates or copies a payload | website-only/local, no API | not built yet — must match fixture |
| Guest persistence, deals and period presentation | Guest saving needs an explicit guest action; sample mode does not persist edits. Recurrence/totals fixtures cover calculations, not every persistence/deal-display UI contract | website-only/local, no API | not built yet — must match fixture |

## Remaining parity gates

- Full-provider rate integration fixtures and the versioned contract are covered by `src/lib/rate-provider.server.test.ts` and `src/lib/rate-api-contract.test.ts`. `src/lib/rate-api.server.test.ts` exercises the implemented HTTP adapter against the schema with mocked success and every documented error. Flutter must use `/api/v1/rates`, not inferred server-function transport URLs; its source scaffold has no rate client yet.
- Android must run equivalent cases before its parity checklist can be ticked. A documentation matrix is not an Android verification.
- Browser storage is optional. Android persistence is not implemented and must not be described as cloud sync or encryption.
- Validate links/imports independently of the form. Today's Float form/date-helper fixes do not claim stricter share-decoder validation, versioning or size limits; the existing Float threat-model document records these separate limitations.
- Add explicit fixtures for uncovered UI/export/persistence workflows before treating those rows as verified cross-platform contracts.