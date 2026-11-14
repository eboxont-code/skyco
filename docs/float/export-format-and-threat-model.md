# Float share format and threat model

Source checked on 14 November 2026: `src/lib/float-share.ts`,
`src/lib/float-guest.ts`, `src/components/float/FloatPlanner.tsx`, and
`src/components/float/EntrySection.tsx`. This documents the current website,
not a proposed mobile contract or a guarantee of secure transport.

## Current export and import

After explicit confirmation, Float creates a same-origin `/float?d=<payload>`
URL from **all current entries**, not just occurrences visible in the selected
planning period. It hands the URL to the device share sheet when available,
otherwise to the clipboard. A failed or cancelled share reports failure; there
is no automatic clipboard retry after a device-share error. There is no file
export/import feature. Loading a link imports figures into the page; new random
entry IDs are assigned locally. The selected planning period is not exported.

The payload is JSON encoded as UTF-8 bytes, then Base64 URL-safe text:
`+` becomes `-`, `/` becomes `_`, and trailing `=` padding is removed. This is
**encoding, not encryption**. Anyone holding the URL can decode the figures.
There is no signature, integrity check, expiry, password or recipient restriction.

The top-level object has exactly these exporter keys:

| Key | Meaning |
| --- | --- |
| `i` | Income tuples |
| `b` | Bill tuples |
| `p` | Buy-now-pay-later tuples |

Each exported tuple is:

```text
[name, amount, date, frequencyIndex, originalAmount, dealEndsOn]
```

- `name`: first 40 JavaScript string code units of the entry name. This is not a
  byte limit or a Unicode grapheme limit; it can split a surrogate pair.
- `amount`: `Math.round(amount * 100) / 100`, interpreted by the planner as AUD.
- `date`: entry date string, normally `YYYY-MM-DD` from the date field.
- `frequencyIndex`: `0` weekly, `1` fortnightly, `2` monthly. The encoder falls
  back to `0` for an unknown frequency.
- `originalAmount`: original amount, or `null` when absent. Not rounded by the encoder.
- `dealEndsOn`: deal-end date string, or `null` when absent.

Synthetic format example, not a real person's figures:

```json
{"i":[["Example",12.34,"2026-11-14",0,null,null]],"b":[],"p":[]}
```

There is **no share-payload version field**. The browser guest-storage key
`skyco.float.guest.v1` is versioned separately and stores the full object form
(`income`, `bills`, `bnpl`), not these tuples. It must not be treated as a share
schema version. There is **no explicit encoded-length, decoded-size, row-count,
numeric magnitude or imported-name-length cap**. The 40-code-unit export name
limit is the only explicit share-size constraint; it does not limit imported names.
Browser/device URL limits may apply but are not enforced by Float.

## Malformed links and validation limits

Missing input, invalid Base64, unparseable JSON, and payloads with no accepted
entries return `null`. The planner then shows its sample figures, not an error
screen. Non-array buckets are treated as empty; invalid rows are filtered out,
so a partially valid link can import only some entries. Unknown extra keys and
tuple fields are ignored. A tuple is accepted when:

- it is an array with a nonblank string name (the decoder does not trim it);
- `Number(amount)` is finite, including coercible strings, zero and negative values;
- `date` matches `YYYY-MM-DD` syntax, **without calendar-day validation**.

Missing/unknown frequency indexes fall back to monthly; numeric-string indexes
are accepted. Optional original amounts are numerically coerced when finite,
otherwise become `null`. Optional deal dates are accepted by the same date regex,
otherwise become `null`. These rules are not a strict schema validator. Amount
`null`, for example, is coerced to zero. Impossible calendar dates can normalize
in subsequent JavaScript date calculations. Form constraints must not be assumed
to protect imported links.

## Threat model

| Threat | Current exposure and controls | Recommendation before mobile persistence |
| --- | --- | --- |
| URL disclosure | Figures can appear in copied messages, browser history, URL screenshots, link previews, recipient devices and potentially hosting/proxy/server logs. The confirmation warns about figures, non-encryption and history/logs. No log capture or retention guarantee is established here. | Prefer private local records; never automatically include payloads in analytics, crash reports or logs. Require explicit export consent and disclose recipient access. |
| Screenshots/local access | Visible figures and guest browser storage are readable by someone with device/profile access. The app does not encrypt guest storage. | Decide on OS-backed protected storage and backup policy; do not claim protection until implemented and tested. |
| Tampering | Anyone can modify the JSON and re-encode it; there is no authenticity proof. Imported negative/coerced amounts and syntactically valid impossible dates can affect totals. | Validate a versioned schema, finite bounded amounts, real dates, recurrence enums and lengths. Show an import preview and request confirmation before overwriting saved records. |
| Oversized payloads | Decode/parse and tuple processing have no explicit limits and run synchronously; large inputs can consume memory, block rendering or fail sharing. | Cap encoded/decoded bytes and per-bucket row counts before allocation; reject excess with an explicit error. Test limits on Android. |
| Silent partial/fallback import | Invalid rows can disappear; wholly invalid links display samples. This can look like a successful import. | Distinguish rejected, partial and successful imports; preserve existing local records and report rejected rows. |
| Recurrence differences | Monthly recurrence currently permits occurrences before a future anchor, unlike weekly recurrence. | Resolve and version that behaviour before a mobile port; retain fixture parity until reviewed. |

Recommendations are **not implemented features**. Sharing currently creates a
URL locally; recipients loading that query URL may send it to hosting infrastructure.
Guest persistence is optional browser local storage, with caught storage failures.
This format is neither a reviewed mobile persistence schema nor cloud sync.