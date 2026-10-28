const countries: Record<string, string> = { USD: "US", EUR: "EU", GBP: "GB", JPY: "JP", INR: "IN", AUD: "AU", CAD: "CA", CHF: "CH", CNY: "CN", SGD: "SG", SEK: "SE", NOK: "NO", NZD: "NZ", BRL: "BR", ZAR: "ZA", NPR: "NP", QAR: "QA", AED: "AE", SAR: "SA", MYR: "MY", KRW: "KR" };
export function currencyFlag(code: string): string {
  const symbol = ({ BTC: "B", ETH: "E", SOL: "S" } as Record<string, string>)[code];
  if (symbol) return symbol;
  const country = countries[code];
  return country ? [...country].map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0))).join("") : "";
}