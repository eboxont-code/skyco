import { Link } from "@tanstack/react-router";

const groups = [
  {
    name: "CurrenSee",
    to: "/currensee",
    faqs: [
      ["Where do the rates come from?", "Currency rates come from Frankfurter (European Central Bank reference rates) and crypto prices from CoinGecko. If the provider fails, CurrenSee shows an error instead of an old number."],
      ["Can I convert Bitcoin?", "Yes. BTC, ETH and SOL are available alongside common currencies. Choose them in the From or To list."],
      ["Why is my amount rejected?", "The amount must be a number above zero, such as 25 or 19.99."],
    ],
  },
  {
    name: "Chronos",
    to: "/chronos",
    faqs: [
      ["Which calendars are shown?", "Gregorian, Hijri (Islamic), Hebrew, Chinese, Persian and Indian Saka, calculated by your browser."],
      ["Does it list festivals or holidays?", "No. Chronos shows dates only. Check observances with your community or an official source."],
      ["Is Indian Saka the same as Nepali Bikram Sambat?", "No. Chronos shows the Indian national Saka calendar, not Bikram Sambat."],
    ],
  },
  {
    name: "My Finance Friend",
    to: "/finance-friend",
    faqs: [
      ["Is my trade saved?", "No. The preview reads your sentence in the page and keeps nothing after you leave or refresh."],
      ["Does it connect to a broker?", "No. It never asks for broker or bank logins and cannot place trades."],
      ["Why does it say Not calculated?", "If you do not type a price, it will not guess one."],
    ],
  },
  {
    name: "Grocery Packs",
    to: "/grocery",
    faqs: [
      ["Are these real shop prices?", "No. The packs are labelled samples with quantities only. There are no prices, shops or suppliers involved."],
      ["How do I print a list?", "Pick a pack and household size, then use Print this list. Only the list is printed."],
      ["Are my ticks saved?", "Ticks are saved for each pack in this browser when browser storage is available."],
    ],
  },
];

export function ProductFaqs() {
  return (
    <section aria-labelledby="product-faq-heading" className="mt-12">
      <h2 id="product-faq-heading" className="text-2xl font-extrabold tracking-tight text-foreground">
        Quick answers by product
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.name} className="rounded-2xl border border-sky-bright/20 bg-card p-6">
            <h3 id={`faq-${g.to.slice(1)}`} className="text-lg font-bold text-foreground">
              <Link to={g.to} className="rounded-sm text-sky-deep underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {g.name}
              </Link>
            </h3>
            <div className="mt-3 space-y-2">
              {g.faqs.map(([q, a]) => (
                <details key={q} className="group rounded-lg border border-sky-bright/15 px-4 py-3">
                  <summary className="cursor-pointer rounded-sm text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
