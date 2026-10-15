export type CurrencyPair = { slug: string; from: string; to: string; explanation: string };

export const PAIRS: CurrencyPair[] = [
  { slug: "aud-to-npr", from: "AUD", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one Australian dollar buys today. It matters most when you send money to family in Nepal or plan a trip home. The rupee is pegged to the Indian rupee, so this rate mostly moves with the Australian dollar against the Indian rupee." },
  { slug: "npr-to-aud", from: "NPR", to: "AUD", explanation: "This rate shows what Nepalese rupees are worth in Australian dollars. It helps when you bring savings from Nepal to Australia or compare prices between the two countries. It moves mostly with the Australian dollar against the Indian rupee." },
  { slug: "usd-to-npr", from: "USD", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one US dollar buys. Many remittances and overseas salaries are paid in US dollars, so it is one of the most watched rates in Nepal. Because of the peg, it follows the US dollar against the Indian rupee." },
  { slug: "npr-to-usd", from: "NPR", to: "USD", explanation: "This rate shows the value of Nepalese rupees in US dollars. It is useful for pricing imports, paying overseas fees or checking savings held in rupees. It follows the Indian rupee against the US dollar." },
  { slug: "npr-to-inr", from: "NPR", to: "INR", explanation: "This rate converts Nepalese rupees into Indian rupees. The two currencies are pegged, so the official rate barely changes. Shops near the border and money changers may still offer a slightly different rate." },
  { slug: "inr-to-npr", from: "INR", to: "NPR", explanation: "This rate converts Indian rupees into Nepalese rupees under the official peg. It is useful for travel, trade and family payments across the border. The official rate stays fixed, while changers may add their own margin." },
  { slug: "aud-to-inr", from: "AUD", to: "INR", explanation: "This rate tells you how many Indian rupees one Australian dollar buys. It matters for students, workers and families sending money from Australia to India. It moves with the Australian dollar on world markets." },
  { slug: "inr-to-aud", from: "INR", to: "AUD", explanation: "This rate shows what Indian rupees are worth in Australian dollars. It helps when you pay Australian fees from India or move savings across. It moves with both economies and global demand for the Australian dollar." },
  { slug: "usd-to-aud", from: "USD", to: "AUD", explanation: "This rate shows how many Australian dollars one US dollar buys. It affects online shopping, imported goods and overseas income. It is one of the most traded currency pairs in the world." },
  { slug: "aud-to-usd", from: "AUD", to: "USD", explanation: "This rate shows what one Australian dollar is worth in US dollars. Travellers, importers and anyone buying from US stores watch it closely. It often moves with commodity prices and interest rate news." },
  { slug: "gbp-to-npr", from: "GBP", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one British pound buys. It matters for families receiving money from the United Kingdom. Because of the peg, it follows the pound against the Indian rupee." },
  { slug: "eur-to-npr", from: "EUR", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one euro buys. It matters for workers and students in Europe sending money home. It follows the euro against the Indian rupee." },
  { slug: "nzd-to-aud", from: "NZD", to: "AUD", explanation: "This rate shows how many Australian dollars one New Zealand dollar buys. It matters for people moving, working or shopping across the Tasman. The two currencies often move together." },
  { slug: "aud-to-nzd", from: "AUD", to: "NZD", explanation: "This rate shows how many New Zealand dollars one Australian dollar buys. It helps with trips, transfers and pricing across the Tasman. Changes are usually gentle because the two economies are closely linked." },
  { slug: "qar-to-npr", from: "QAR", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one Qatari riyal buys. Many Nepali workers in Qatar send money home, so this rate matters to a lot of families. The riyal is pegged to the US dollar, so it moves much like the US dollar rate." },
  { slug: "aed-to-npr", from: "AED", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one UAE dirham buys. It matters for workers in the United Arab Emirates sending money to Nepal. The dirham is pegged to the US dollar, so it tracks the US dollar rate closely." },
  { slug: "sar-to-npr", from: "SAR", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one Saudi riyal buys. It matters for families with relatives working in Saudi Arabia. The riyal is pegged to the US dollar, so it moves with the US dollar rate." },
  { slug: "myr-to-npr", from: "MYR", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one Malaysian ringgit buys. Malaysia is a common destination for Nepali workers, so many remittances start in ringgit. The ringgit floats, so this rate can move more than the Gulf pairs." },
  { slug: "jpy-to-npr", from: "JPY", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one Japanese yen buys. It matters for students and workers in Japan sending money to Nepal. Because one yen is a small unit, it is often easier to look at larger amounts." },
  { slug: "krw-to-npr", from: "KRW", to: "NPR", explanation: "This rate tells you how many Nepalese rupees one South Korean won buys. Many Nepali workers in Korea send money home, so the rate matters to their families. One won is a very small unit, so larger amounts give a clearer picture." },
];

export const pairBySlug = (slug: string) => PAIRS.find((p) => p.slug === slug);
export const pairPath = (p: CurrencyPair) => `/currensee/${p.slug}`;

const hasNpr = (p: CurrencyPair) => p.from === "NPR" || p.to === "NPR";

export function relatedPairs(p: CurrencyPair): CurrencyPair[] {
  const reverse = PAIRS.find((x) => x.from === p.to && x.to === p.from);
  const others = PAIRS.filter(
    (x) => x.slug !== p.slug && x.slug !== reverse?.slug && [x.from, x.to].some((c) => c === p.from || c === p.to),
  ).sort((a, b) => Number(hasNpr(b)) - Number(hasNpr(a)));
  return [...(reverse ? [reverse] : []), ...others.slice(0, 4)];
}

export const PAIR_GROUPS: { name: string; pairs: CurrencyPair[] }[] = [
  { name: "Nepal", pairs: PAIRS.filter(hasNpr) },
  { name: "Australia", pairs: PAIRS.filter((p) => !hasNpr(p) && (p.from === "AUD" || p.to === "AUD")) },
  { name: "Other", pairs: PAIRS.filter((p) => !hasNpr(p) && p.from !== "AUD" && p.to !== "AUD") },
].filter((g) => g.pairs.length > 0);
