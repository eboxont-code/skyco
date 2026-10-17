export const ADDITIONAL_NRB_CURRENCIES: Record<string, string> = {
  KWD: "Kuwaiti dinar",
  BHD: "Bahraini dinar",
  HKD: "Hong Kong dollar",
};

export function converterCurrencies(existing: string[]) {
  return [...new Set([...existing, ...Object.keys(ADDITIONAL_NRB_CURRENCIES)])];
}