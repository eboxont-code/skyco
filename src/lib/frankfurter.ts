/** Current Frankfurter v1 HTTP contract. No provider requests run in this module. */
export const FRANKFURTER_API_VERSION = "v1";
export const FRANKFURTER_API_BASE = `https://api.frankfurter.dev/${FRANKFURTER_API_VERSION}`;

export function frankfurterLatestUrl(symbols: string) {
  return `${FRANKFURTER_API_BASE}/latest?base=USD&symbols=${symbols}`;
}

export function frankfurterHistoryUrl(start: string, from: string, to: string) {
  return `${FRANKFURTER_API_BASE}/${start}..?base=${from}&symbols=${to}`;
}
