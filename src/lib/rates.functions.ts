import { createServerFn } from "@tanstack/react-start";
import { CURRENCIES, CURRENCY_NAMES } from "./rates.shared";

export { CURRENCIES, CURRENCY_NAMES } from "./rates.shared";
export type { RateResult } from "./rates.shared";

export const getRate = createServerFn({ method: "GET" })
  .validator((data: { from: string; to: string }) => {
    const from = String(data?.from ?? "USD").toUpperCase();
    const to = String(data?.to ?? "EUR").toUpperCase();
    if (!CURRENCIES.includes(from) || !CURRENCIES.includes(to)) {
      throw new Error("unsupported currency");
    }
    return { from, to };
  })
  .handler(async ({ data }) => {
    const { loadRate } = await import("./rate-provider.server");
    return loadRate(data.from, data.to);
  });

export type NprRateRow = { iso3: string; name: string; unit: number; buy: number; sell: number; midpoint: number; perOne: number };
export type NprRatesDay = { date: string; rows: NprRateRow[]; fallback: boolean } | null;

/** Latest Nepal Rastra Bank day, reusing the hourly NRB cache. Null when NRB is unavailable. */
export const getNprRates = createServerFn({ method: "GET" }).handler(async (): Promise<NprRatesDay> => {
  try {
    const { loadNrbDays } = await import("./nrb-rates.server");
    const { days, fallback } = await loadNrbDays();
    const latest = days[days.length - 1];
    if (!latest) return null;
    const rows: NprRateRow[] = [];
    for (const r of latest.rates) {
      const buy = Number(r.buy), sell = Number(r.sell), unit = Number(r.currency.unit);
      if (!(Number.isFinite(buy) && Number.isFinite(sell) && Number.isFinite(unit) && buy > 0 && sell > 0 && unit > 0)) continue;
      const midpoint = (buy + sell) / 2;
      rows.push({ iso3: r.currency.iso3, name: CURRENCY_NAMES[r.currency.iso3] ?? r.currency.name ?? r.currency.iso3, unit, buy, sell, midpoint, perOne: midpoint / unit });
    }
    return rows.length ? { date: latest.date, rows, fallback } : null;
  } catch {
    return null;
  }
});
