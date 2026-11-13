/** Current Frankfurter v1 HTTP contract. No provider requests run in this module. */
export const FRANKFURTER_API_VERSION = "v1";
export const FRANKFURTER_API_BASE = `https://api.frankfurter.dev/${FRANKFURTER_API_VERSION}`;

export type FrankfurterLatestRates = { date: string; rates: Record<string, number> };

type JsonRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Convert Frankfurter's USD-base values into USD per one unit of each currency. */
export function parseFrankfurterLatest(json: unknown): FrankfurterLatestRates {
  if (
    !isRecord(json) ||
    typeof json.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(json.date) ||
    !Number.isFinite(Date.parse(json.date)) ||
    !isRecord(json.rates)
  ) {
    throw new Error("rate source unavailable");
  }

  const rates: Record<string, number> = { USD: 1 };
  for (const [code, value] of Object.entries(json.rates)) {
    const perUsd = Number(value);
    if (/^[A-Z]{3}$/.test(code) && Number.isFinite(perUsd) && perUsd > 0) {
      rates[code] = 1 / perUsd;
    }
  }
  return { date: json.date, rates };
}

/** Keep only positive, provider-published history points; never fill missing dates. */
export function parseFrankfurterHistory(json: unknown, to: string) {
  if (!isRecord(json) || !isRecord(json.rates)) return [];
  return Object.entries(json.rates)
    .flatMap(([date, row]) => {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(date)) ||
        !isRecord(row)
      ) {
        return [];
      }
      const value = Number(row[to]);
      return Number.isFinite(value) && value > 0 ? [{ date, value }] : [];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function frankfurterLatestUrl(symbols: string) {
  return `${FRANKFURTER_API_BASE}/latest?base=USD&symbols=${symbols}`;
}

export function frankfurterHistoryUrl(start: string, from: string, to: string) {
  return `${FRANKFURTER_API_BASE}/${start}..?base=${from}&symbols=${to}`;
}
