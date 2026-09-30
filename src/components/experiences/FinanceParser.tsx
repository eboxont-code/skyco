import { useState } from "react";

/**
 * The My Finance Friend entry step, running on skyco.online itself.
 * Type a holding in plain English and check the parsed preview. This demo does not save it.
 */
type Parsed = {
  action: string;
  quantity: number;
  ticker: string;
  price: number | null;
  when: string;
};

const EXAMPLES = [
  "bought 50 shares of NVDA today at $145",
  "sold 10 AAPL at 212.40 yesterday",
  "added 3 shares of VOO at $505",
];

export function FinanceParser() {
  const [text, setText] = useState(EXAMPLES[0]!);
  const parsed = parseHolding(text);

  return (
    <div className="rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-sky-deep">
        Type a holding
      </h2>
      <label className="mt-3 block">
        <span className="sr-only">Describe a trade in plain English</span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="bought 50 shares of NVDA today at $145"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          aria-describedby="parser-help"
          aria-invalid={text.trim().length > 0 && parsed === null}
          className="min-h-12 w-full rounded-xl border border-sky-bright/30 bg-background px-3 text-base text-foreground outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setText(e)}
            className="min-h-11 rounded-full border border-sky-bright/30 px-4 text-xs font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-sky-bright/20 bg-sky-ice/30 p-4" role="status" aria-live="polite" aria-atomic="true">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Parsed preview
        </p>
        {parsed ? (
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Action" value={parsed.action} />
            <Field label="Quantity" value={String(parsed.quantity)} />
            <Field label="Ticker" value={parsed.ticker} />
            <Field
              label="Price"
              value={parsed.price === null ? "Not provided" : `$${parsed.price.toFixed(2)}`}
            />
            <Field label="Date" value={parsed.when} />
            <Field
              label="Value"
              value={
                parsed.price === null
                  ? "Not calculated"
                  : `$${(parsed.price * parsed.quantity).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}`
              }
            />
          </dl>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            I could not read a trade from that line yet. Include an action, a quantity and a
            ticker, for example: bought 50 shares of NVDA today at $145.
          </p>
        )}
      </div>
      <p id="parser-help" className="mt-3 text-xs text-muted-foreground">
        Nothing is stored or sent from this preview. Check every field yourself before relying on it.
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-sky-deep">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function parseHolding(input: string): Parsed | null {
  const text = input.trim();
  if (!text) return null;

  const action = /\b(sold|sell)\b/i.test(text)
    ? "Sell"
    : /\b(bought|buy|added|add)\b/i.test(text)
      ? "Buy"
      : null;
  if (!action) return null;

  const qtyMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:shares?|units?)?/i);
  const quantity = qtyMatch ? Number(qtyMatch[1]) : NaN;
  if (!isFinite(quantity) || quantity <= 0) return null;

  const tickerMatch =
    text.match(/\b(?:of|in)\s+([A-Za-z.]{1,6})\b/) ?? text.match(/\b([A-Z]{1,5})\b/);
  const ticker = tickerMatch?.[1]?.toUpperCase();
  if (!ticker) return null;

  const priceMatch = text.match(/(?:at|@|for)\s*\$?\s*(\d+(?:[.,]\d+)?)/i);
  const price = priceMatch ? Number(priceMatch[1]!.replace(",", "")) : null;

  const when = /yesterday/i.test(text)
    ? "Yesterday"
    : /today/i.test(text)
      ? "Today"
      : "Today (assumed)";

  return { action, quantity, ticker, price, when };
}
