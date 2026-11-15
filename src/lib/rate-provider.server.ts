import { createRateCache } from "./rate-cache";
import {
  frankfurterLatestUrl,
  frankfurterHistoryUrl,
  parseFrankfurterLatest,
  parseFrankfurterHistory,
} from "./frankfurter";
import { CRYPTO, CURRENCIES, FIAT, type RateResult } from "./rates.shared";
import type { NrbDay } from "./nrb-rates.server";

type NrbPayload = { days: NrbDay[]; fallback: boolean };
type RateProviderOptions = {
  request?: typeof fetch;
  loadNrbDays?: () => Promise<NrbPayload>;
  now?: () => number;
  nowIso?: () => string;
};

async function loadPublishedNrbDays(): Promise<NrbPayload> {
  const { loadNrbDays } = await import("./nrb-rates.server");
  return loadNrbDays();
}

function nprTable(day: NrbDay): Record<string, number> {
  const table: Record<string, number> = { NPR: 1 };
  for (const row of day.rates) {
    const buy = Number(row.buy);
    const sell = Number(row.sell);
    const unit = Number(row.currency.unit);
    if (
      Number.isFinite(buy) &&
      Number.isFinite(sell) &&
      Number.isFinite(unit) &&
      buy > 0 &&
      sell > 0 &&
      unit > 0
    ) {
      table[row.currency.iso3] = (buy + sell) / 2 / unit;
    }
  }
  return table;
}

/** Build the provider-backed rate lookup with injectable I/O for deterministic tests. */
export function createRateProvider(options: RateProviderOptions = {}) {
  const request = options.request ?? fetch;
  const loadNrbDays = options.loadNrbDays ?? loadPublishedNrbDays;
  const now = options.now ?? Date.now;
  const nowIso = options.nowIso ?? (() => new Date(now()).toISOString());
  const cachedRate = createRateCache<RateResult>(CURRENCIES.length ** 2, now);

  async function fiatUsdTable(): Promise<{ date: string; rates: Record<string, number> }> {
    const symbols = FIAT.filter(
      (code) => code !== "USD" && !["NPR", "QAR", "AED", "SAR"].includes(code),
    ).join(",");
    const response = await request(frankfurterLatestUrl(symbols));
    if (!response.ok) throw new Error("rate source unavailable");
    return parseFrankfurterLatest(await response.json());
  }

  async function cryptoUsd(codes: string[]): Promise<Record<string, number>> {
    if (codes.length === 0) return {};
    const ids = codes.map((code) => CRYPTO[code]).join(",");
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=" + ids + "&vs_currencies=usd";
    const response = await request(url);
    if (!response.ok) throw new Error("crypto source unavailable");
    const json = (await response.json()) as Record<string, { usd: number }>;
    const result: Record<string, number> = {};
    for (const code of codes) result[code] = json[CRYPTO[code] ?? ""]?.usd ?? 0;
    return result;
  }

  async function fiatSeries(from: string, to: string) {
    const start = new Date(now() - 30 * 86400000).toISOString().slice(0, 10);
    const response = await request(frankfurterHistoryUrl(start, from, to));
    if (!response.ok) return [];
    return parseFrankfurterHistory(await response.json(), to);
  }

  async function cryptoSeries(code: string, multiplier: number) {
    const url =
      "https://api.coingecko.com/api/v3/coins/" +
      CRYPTO[code] +
      "/market_chart?vs_currency=usd&days=30&interval=daily";
    const response = await request(url);
    if (!response.ok) return [];
    const json = (await response.json()) as { prices: [number, number][] };
    return json.prices.map(([milliseconds, price]) => ({
      date: new Date(milliseconds).toISOString().slice(0, 10),
      value: price * multiplier,
    }));
  }

  return async (from: string, to: string): Promise<RateResult> =>
    cachedRate(from, to, async () => {
      let fiat: Record<string, number> = {};
      let asOf = "";
      const needsNrb = [from, to].some((code) => ["NPR", "QAR", "AED", "SAR"].includes(code));
      let nrb: NrbDay[] = [];
      let nrbFallback = false;
      let nrbSource: RateResult["source"] = "Nepal Rastra Bank";

      if (needsNrb) {
        try {
          const payload = await loadNrbDays();
          nrb = payload.days;
          nrbFallback = payload.fallback;
          const latest = nrb[nrb.length - 1];
          if (!latest) throw new Error("Reference rates unavailable");
          const table = nprTable(latest);
          const usd = table.USD;
          if (!usd) throw new Error("Reference rates unavailable");
          for (const [code, perNpr] of Object.entries(table)) fiat[code] = perNpr / usd;
          if (
            (!(from in CRYPTO) && !fiat[from]) ||
            (!(to in CRYPTO) && !fiat[to])
          ) {
            throw new Error("Reference rates unavailable");
          }
          asOf = latest.date;
        } catch {
          if ([from, to].some((code) => ["QAR", "AED", "SAR"].includes(code))) {
            throw new Error("Reference rates unavailable");
          }
          const latest = await fiatUsdTable();
          fiat = latest.rates;
          asOf = latest.date;
          fiat.NPR = (fiat.INR ?? 0) / 1.6;
          nrbSource = "Derived from INR at the official 1.6 peg";
        }
      }

      if (!needsNrb) {
        const latest = await fiatUsdTable();
        fiat = latest.rates;
        asOf = latest.date;
      }

      const cryptoCodes = [from, to].filter((code) => code in CRYPTO);
      const crypto = await cryptoUsd([...new Set(cryptoCodes)]);
      const usdPer = (code: string) =>
        code in CRYPTO ? crypto[code] ?? 0 : fiat[code] ?? 0;
      const rate = usdPer(from) / usdPer(to);
      if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error("Reference rates unavailable");
      }

      let series: { date: string; value: number }[] = [];
      let approximate = false;
      try {
        if (needsNrb) {
          series = nrb
            .flatMap((day) => {
              const table = nprTable(day);
              const fromValue = table[from];
              const toValue = table[to];
              return fromValue && toValue
                ? [{ date: day.date, value: fromValue / toValue }]
                : [];
            })
            .sort((a, b) => a.date.localeCompare(b.date));
        } else if (cryptoCodes.length === 0) {
          series = await fiatSeries(from, to);
        } else if (from in CRYPTO) {
          series = await cryptoSeries(from, 1 / usdPer(to));
          approximate = to !== "USD";
        } else {
          const inverse = await cryptoSeries(to, 1);
          series = inverse.map((point) => ({
            date: point.date,
            value: usdPer(from) / point.value,
          }));
          approximate = from !== "USD";
        }
      } catch {
        series = [];
      }

      return {
        source: needsNrb
          ? nrbSource
          : cryptoCodes.length
            ? "CoinGecko"
            : "Frankfurter",
        from,
        to,
        rate,
        asOf,
        fetchedAt: nowIso(),
        series: series.slice(-31),
        approximate,
        stale: needsNrb && nrbSource === "Nepal Rastra Bank" && nrbFallback,
        ...(needsNrb && nrbSource === "Nepal Rastra Bank" ? { nrbFallback } : {}),
      };
    });
}

export const loadRate = createRateProvider();
