import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

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
  const [text, setText] = useState(EXAMPLES[0] ?? "");
  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [history, setHistory] = useState<Parsed[]>([]);
  const [savedStatus, setSavedStatus] = useState("");
  const parsed = parseHolding(text);
  const total = holdingTotal(history);

  return (
    <div className="rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <label htmlFor="ff-input" className="text-sm font-bold uppercase tracking-wider text-sky-deep">
        Type a holding
      </label>
      <div className="mt-3 block">
        <input
          id="ff-input"
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="bought 50 shares of NVDA today at $145"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          onKeyDown={e => { if (e.key === "Enter") previewRef.current?.focus(); }}
          aria-describedby="parser-help"
          aria-invalid={text.trim().length > 0 && parsed === null}
          className="min-h-12 w-full rounded-xl border border-sky-bright/30 bg-background px-3 text-base text-foreground outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <button type="button" onClick={() => { setText(""); inputRef.current?.focus(); }} className="mt-3 min-h-11 rounded-full border border-sky-bright/30 px-4 text-xs font-semibold text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">Clear</button>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setText(e)}
            aria-pressed={text === e}
            className="min-h-11 rounded-full border border-sky-bright/30 px-4 text-xs font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {e}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status">{parsed ? `${parsed.action} ${parsed.quantity} ${parsed.ticker}${parsed.price === null ? ", price not provided" : ` at $${parsed.price.toFixed(2)}`}, ${parsed.when.toLowerCase()}` : text.trim() ? "Trade not recognised" : "Field cleared"}</p>
      <div ref={previewRef} tabIndex={-1} aria-label="Parsed preview" className="focus:outline-none mt-5 rounded-xl border border-sky-bright/20 bg-sky-ice/30 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Parsed preview
        </p>
        {parsed ? (
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Side" value={parsed.action} />
            <Field label="Quantity" value={String(parsed.quantity)} />
            <Field label="Ticker" value={parsed.ticker} />
            <Field
              label="Price"
              value={parsed.price === null ? "Not provided" : `$${parsed.price.toFixed(2)}`}
            />
            <div><Field label="Date" value={parsed.when} />{parsed.when === "Today (assumed)" && <p className="mt-1 text-xs text-muted-foreground">Date assumed to be today</p>}</div>
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
          <p role="alert" className="mt-2 text-sm text-muted-foreground">
            I could not read a trade from that line yet. Include an action, a quantity and a
            ticker, for example: bought 50 shares of NVDA today at $145.
          </p>
        )}
      </div>
      <button type="button" disabled={!parsed} onClick={async () => {
        if (!parsed) return;
        const csv = `action,quantity,ticker,price,date,value\n${parsed.action},${parsed.quantity},${parsed.ticker},${parsed.price ?? ""},${parsed.when},${parsed.price === null ? "" : parsed.price * parsed.quantity}`;
        try { await navigator.clipboard.writeText(csv); setCopyStatus("CSV copied"); } catch { setCopyStatus("Copy unavailable in this browser"); }
      }} className="mt-3 min-h-11 rounded-full border border-sky-bright/30 px-4 text-xs font-semibold text-sky-deep focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">Copy as CSV</button>
      <span role="status" className="ml-3 text-xs text-muted-foreground">{copyStatus}</span>
      <Button variant="outline" className="mt-3 min-h-11" disabled={!parsed} onClick={() => { if (parsed) setHistory(previous => [parsed, ...previous].slice(0, 5)); }}>Keep in this session</Button>
      {history.length > 0 && <div className="mt-3"><button type="button" onClick={async () => { const csv = ["ticker,quantity,price,side", ...history.map(h => `${h.ticker},${h.quantity},${h.price ?? ""},${h.action}`)].join("\n"); try { await navigator.clipboard.writeText(csv); setSavedStatus(`Copied ${history.length} saved ${history.length === 1 ? "holding" : "holdings"} as CSV`); } catch { setSavedStatus("Copy unavailable in this browser"); } }} className="min-h-11 rounded-full border border-sky-bright/30 px-4 text-xs font-semibold text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">Copy saved as CSV</button><span role="status" className="ml-3 text-xs text-muted-foreground">{savedStatus}</span></div>}
      {history.length > 0 && <Button variant="outline" className="mt-3 min-h-11" onClick={() => { if (window.confirm("Clear all saved holdings?")) { setHistory([]); setSavedStatus("Saved holdings cleared"); } }}>Clear all</Button>}
      {history.length > 0 && <section aria-labelledby="history-heading" className="mt-4"><h3 id="history-heading" className="font-semibold text-foreground">Recent holdings</h3><ul>{history.map((holding, index) => <li key={index} className="flex flex-wrap items-center justify-between gap-2 text-sm text-foreground"><span><span className={`mr-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${holding.action === "Sell" ? "bg-muted text-foreground" : "bg-sky-ice text-sky-deep"}`}>{holding.action}</span>{holding.quantity} {holding.ticker}{holding.price === null ? "" : ` at $${holding.price}`}</span><Button variant="ghost" className="min-h-11" aria-label={`Remove ${holding.quantity} ${holding.ticker} holding`} onClick={() => setHistory(previous => previous.filter((_, i) => i !== index))}>Remove</Button></li>)}</ul></section>}
      {history.length > 0 && <p className="mt-3 text-sm font-semibold text-foreground">Total value: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(total)}{history.some(holding => holding.price === null) && <span className="block font-normal text-muted-foreground">Holdings without a price are not included.</span>}</p>}
      <p id="parser-help" className="mt-3 text-xs text-muted-foreground">
        Holdings kept here last only while this page is open. Nothing is sent or saved after leaving. Check every field yourself before relying on it.
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

export function holdingTotal(holdings: ReadonlyArray<Pick<Parsed, "quantity" | "price">>): number {
  return holdings.reduce((sum, holding) => sum + holding.quantity * (holding.price ?? 0), 0);
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

  const priceMatch = text.match(/(?:\bat\b|@|\bfor\b)\s*\$?\s*(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)/i);
  const price = priceMatch ? Number((priceMatch[1] ?? "").replace(/,/g, "")) : null;

  const when = /yesterday/i.test(text)
    ? "Yesterday"
    : /today/i.test(text)
      ? "Today"
      : "Today (assumed)";

  return { action, quantity, ticker, price, when };
}
