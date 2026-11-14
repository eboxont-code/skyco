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
  "NPR",
  "QAR",
  "AED",
  "SAR",
  "MYR",
  "KRW",
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
  source: "Frankfurter" | "CoinGecko" | "Nepal Rastra Bank" | "Derived from INR at the official 1.6 peg";
  asOf: string;
  fetchedAt: string;
  series: { date: string; value: number }[];
  approximate: boolean;
  nrbFallback?: boolean;
  stale?: boolean;
};

export const CURRENCY_NAMES: Record<string, string> = {
  NPR: "Nepalese rupee",
  QAR: "Qatari riyal",
  AED: "UAE dirham",
  SAR: "Saudi riyal",
  MYR: "Malaysian ringgit",
  KRW: "South Korean won",
  USD: "US dollar",
  EUR: "Euro",
  GBP: "British pound",
  JPY: "Japanese yen",
  INR: "Indian rupee",
  AUD: "Australian dollar",
  CAD: "Canadian dollar",
  CHF: "Swiss franc",
  CNY: "Chinese yuan",
  SGD: "Singapore dollar",
  SEK: "Swedish krona",
  NOK: "Norwegian krone",
  NZD: "New Zealand dollar",
  BRL: "Brazilian real",
  ZAR: "South African rand",
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
};
