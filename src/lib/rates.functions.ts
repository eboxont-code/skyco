import { createServerFn } from "@tanstack/react-start";

/**
 * Live rate lookup for the in-hub CurrenSee converter.
 * Fiat comes from Frankfurter (ECB reference rates), crypto from CoinGecko.
 * Everything is priced through USD so any pair in the list works.
 */

export const FIAT = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "INR",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SGD",
  "SEK",
  "NOK",
  "NZD",
  "BRL",
  "ZAR",
] as const;

export const CRYPTO: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
};

export const CURRENCIES = [...FIAT, ...Object.keys(CRYPTO)];

export type RateResult = {
  from: string;
  to: string;
  rate: number;
  source: "Frankfurter" | "CoinGecko";
  asOf: string;
  fetchedAt: string;
  series: { date: string; value: number }[];
  approximate: boolean;
};

async function fiatUsdTable(): Promise<Record<string, number>> {
  const symbols = FIAT.filter((c) => c !== "USD").join(",");
  const res = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${symbols}`,
  );
  if (!res.ok) throw new Error("rate source unavailable");
  const json = (await res.json()) as { date: string; rates: Record<string, number> };
  // usdPerUnit: how many USD one unit of the currency is worth
  const table: Record<string, number> = { USD: 1 };
  for (const [code, perUsd] of Object.entries(json.rates)) table[code] = 1 / perUsd;
  table["__date"] = 0;
  (table as Record<string, number> & { date?: string }).date = json.date as never;
  return table;
}

async function cryptoUsd(codes: string[]): Promise<Record<string, number>> {
  if (codes.length === 0) return {};
  const ids = codes.map((c) => CRYPTO[c]).join(",");
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
  );
  if (!res.ok) throw new Error("crypto source unavailable");
  const json = (await res.json()) as Record<string, { usd: number }>;
  const out: Record<string, number> = {};
  for (const code of codes) out[code] = json[CRYPTO[code] ?? ""]?.usd ?? 0;
  return out;
}

async function fiatSeries(from: string, to: string) {
  const start = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const res = await fetch(
    `https://api.frankfurter.dev/v1/${start}..?base=${from}&symbols=${to}`,
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { rates: Record<string, Record<string, number>> };
  return Object.entries(json.rates)
    .map(([date, r]) => ({ date, value: r[to] ?? 0 }))
    .filter((p) => p.value > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function cryptoSeries(code: string, multiplier: number) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${CRYPTO[code]}/market_chart?vs_currency=usd&days=30&interval=daily`,
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { prices: [number, number][] };
  return json.prices.map(([ms, price]) => ({
    date: new Date(ms).toISOString().slice(0, 10),
    value: price * multiplier,
  }));
}

const pairCache = new Map<string, { expires: number; result: RateResult }>();

export const CURRENCY_NAMES: Record<string, string> = { USD: "US dollar", EUR: "Euro", GBP: "British pound", JPY: "Japanese yen", INR: "Indian rupee", AUD: "Australian dollar", CAD: "Canadian dollar", CHF: "Swiss franc", CNY: "Chinese yuan", SGD: "Singapore dollar", SEK: "Swedish krona", NOK: "Norwegian krone", NZD: "New Zealand dollar", BRL: "Brazilian real", ZAR: "South African rand", BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana" };

export const getRate = createServerFn({ method: "GET" })
  .inputValidator((data: { from: string; to: string }) => {
    const from = String(data?.from ?? "USD").toUpperCase();
    const to = String(data?.to ?? "EUR").toUpperCase();
    if (!CURRENCIES.includes(from) || !CURRENCIES.includes(to)) {
      throw new Error("unsupported currency");
    }
    return { from, to };
  })
  .handler(async ({ data }): Promise<RateResult> => {
    const { from, to } = data;
    const key = `${from}:${to}`;
    const cached = pairCache.get(key);
    if (cached && cached.expires > Date.now()) return cached.result;
    const fiat = await fiatUsdTable();
    const asOf = (fiat as unknown as { date: string }).date ?? new Date().toISOString().slice(0, 10);
    const cryptoCodes = [from, to].filter((c) => c in CRYPTO);
    const crypto = await cryptoUsd([...new Set(cryptoCodes)]);

    const usdPer = (code: string) => (code in CRYPTO ? crypto[code] ?? 0 : fiat[code] ?? 0);
    const rate = usdPer(from) / usdPer(to);

    let series: { date: string; value: number }[] = [];
    let approximate = false;
    try {
      if (cryptoCodes.length === 0) {
        series = await fiatSeries(from, to);
      } else if (from in CRYPTO) {
        series = await cryptoSeries(from, 1 / usdPer(to));
        approximate = to !== "USD";
      } else {
        const inverse = await cryptoSeries(to, 1);
        series = inverse.map((p) => ({ date: p.date, value: usdPer(from) / p.value }));
        approximate = from !== "USD";
      }
    } catch {
      series = [];
    }

    const result: RateResult = {
      source: cryptoCodes.length ? "CoinGecko" : "Frankfurter",
      from,
      to,
      rate,
      asOf,
      fetchedAt: new Date().toISOString(),
      series: series.slice(-31),
      approximate,
    };
    for (const [oldKey, entry] of pairCache) if (entry.expires <= Date.now()) pairCache.delete(oldKey);
    pairCache.set(key, { expires: Date.now() + 60_000, result });
    return result;
  });
