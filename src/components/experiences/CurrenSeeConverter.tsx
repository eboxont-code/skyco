import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useWebMCPTools, text } from "@/lib/webmcp";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, RefreshCw, Star, X } from "lucide-react";
import { CURRENCIES, CURRENCY_NAMES, getRate, getNprRates, type RateResult } from "@/lib/rates.functions";
import { ADDITIONAL_NRB_CURRENCIES, converterCurrencies } from "@/lib/converter-currencies";
import { currencyFlag } from "@/lib/currency-flags";
import { getDefaultPair, getFavorites, isFavorite, setDefaultPair, toggleFavorite, getSavedConversions, saveConversion, clearSavedConversions, type SavedConversion, type Pair } from "@/lib/currensee-store";

const SELECTABLE_CURRENCIES = converterCurrencies(CURRENCIES);

/**
 * The CurrenSee converter, running on skyco.online itself.
 * Opens on USD to EUR with a live rate and a 30 day chart already on screen.
 */
export function CurrenSeeConverter({ initialFrom, initialTo, initialAmount, initialRate, onConversionChange }: { initialFrom?: string; initialTo?: string; initialAmount?: string; initialRate?: RateResult; onConversionChange?: (values: { from: string; to: string; amount: string }) => void }) {
  const safeFrom = initialFrom && SELECTABLE_CURRENCIES.includes(initialFrom) ? initialFrom : "USD";
  const safeTo = initialTo && SELECTABLE_CURRENCIES.includes(initialTo) ? initialTo : "EUR";
  const [from, setFrom] = useState(safeFrom);
  const [to, setTo] = useState(safeTo);
  const [amount, setAmount] = useState(initialAmount ?? "100");
  const fetchRate = useServerFn(getRate);
  const fetchNprRates = useServerFn(getNprRates);
  useWebMCPTools([{ name: "get_currency_rate", description: "Get the current reference rate for a supported currency pair.", inputSchema: { type: "object", properties: { from: { type: "string", enum: CURRENCIES }, to: { type: "string", enum: CURRENCIES } }, required: ["from", "to"], additionalProperties: false }, execute: async args => { const from = String(args.from ?? "").toUpperCase(); const to = String(args.to ?? "").toUpperCase(); if (!CURRENCIES.includes(from) || !CURRENCIES.includes(to)) return text("Choose two supported currency codes."); try { const result = await fetchRate({ data: { from, to } }); return text(`1 ${from} = ${currencyFormat(result.rate, to, true)}, reference rate for ${result.asOf}. Source: ${result.source}`); } catch { return text("Rate service unavailable. No current rate could be retrieved."); } } }]);
  const [swapStatus, setSwapStatus] = useState("");
  const [recent, setRecent] = useState<{ from: string; to: string }[]>([]);
  const [favorites, setFavorites] = useState<Pair[]>([]);
  const [favoriteStatus, setFavoriteStatus] = useState("");
  const [defaultStatus, setDefaultStatus] = useState("");
  const [savedConversions, setSavedConversions] = useState<SavedConversion[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setFavorites(getFavorites());
    setSavedConversions(getSavedConversions());
    let restoredLast = false;
    try {
      const last: unknown = JSON.parse(localStorage.getItem("skyco.currensee.last") ?? "null");
      if (last && typeof last === "object" && "from" in last && "to" in last && "amount" in last && typeof last.from === "string" && typeof last.to === "string" && typeof last.amount === "string" && CURRENCIES.includes(last.from) && CURRENCIES.includes(last.to) && /^\d+(?:\.\d+)?$/.test(last.amount) && last.amount.length <= 30 && Number.isFinite(Number(last.amount)) && Number(last.amount) > 0) {
        if (!initialFrom) setFrom(last.from);
        if (!initialTo) setTo(last.to);
        if (!initialAmount) setAmount(last.amount);
        restoredLast = true;
      }
    } catch { /* Storage is optional. */ }
    if (!restoredLast && !initialFrom && !initialTo) {
      const fallbackPair = getDefaultPair();
      if (fallbackPair) {
        setFrom(fallbackPair.from);
        setTo(fallbackPair.to);
      }
    }
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("skyco.currensee.recent") ?? "[]");
      if (Array.isArray(saved)) setRecent(saved.filter((p): p is { from: string; to: string } => p && typeof p.from === "string" && typeof p.to === "string" && CURRENCIES.includes(p.from) && CURRENCIES.includes(p.to)).slice(0, 5));
    } catch { /* Storage is optional. */ }
    setStorageReady(true);
  }, []);
  useEffect(() => {
    if (!storageReady) return;
    setRecent(previous => {
      const next = [{ from, to }, ...previous.filter(p => p.from !== from || p.to !== to)].slice(0, 5);
      try { localStorage.setItem("skyco.currensee.recent", JSON.stringify(next)); } catch { /* Storage is optional. */ }
      return next;
    });
  }, [from, to, storageReady]);
  useEffect(() => {
    if (!storageReady) return;
    const normalized = amount.replace(/,/g, "");
    if (!/^\d+(?:\.\d+)?$/.test(normalized) || normalized.length > 30 || !Number.isFinite(Number(normalized)) || Number(normalized) <= 0) return;
    try { localStorage.setItem("skyco.currensee.last", JSON.stringify({ from, to, amount: normalized })); } catch { /* Storage is optional. */ }
  }, [from, to, amount, storageReady]);
  const [resultStatus, setResultStatus] = useState("");
  const [, setTick] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setTick(t => t + 1), 60_000); return () => window.clearInterval(id); }, []);
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    const link = `https://skyco.online/currensee?${new URLSearchParams({ from, to, amount: amount.replace(/,/g, "") })}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link", link);
    }
  };

  const query = useQuery<RateResult>({
    queryKey: ["rate", from, to],
    queryFn: async () => {
      if (initialTo !== "NPR" && initialFrom !== "NPR" || from !== "NPR" && to !== "NPR") return fetchRate({ data: { from, to } });
      const day = await fetchNprRates();
      const row = day?.rows.find(r => r.iso3 === (to === "NPR" ? from : to));
      if (!day || !row) throw new Error("Nepal Rastra Bank reference unavailable");
      return { from, to, rate: to === "NPR" ? row.perOne : 1 / row.perOne, source: "Nepal Rastra Bank", asOf: day.date, fetchedAt: new Date().toISOString(), series: [], approximate: false };
    },
    initialData: from === initialRate?.from && to === initialRate?.to ? initialRate : undefined,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const data = query.data;
  const normalizedAmount = amount.replace(/,/g, "");
  const parsedAmount = Number(normalizedAmount);
  const amountIsValid = /^\d+(?:\.\d+)?$/.test(normalizedAmount) && Number.isFinite(parsedAmount) && parsedAmount > 0;
  const converted = data && amountIsValid ? parsedAmount * data.rate : null;
  useEffect(() => {
    if (!storageReady || !amountIsValid) return;
    const current = new URLSearchParams(window.location.search);
    if (current.get("from") === from && current.get("to") === to && current.get("amount") === normalizedAmount) return;
    onConversionChange?.({ from, to, amount: normalizedAmount });
  }, [from, to, normalizedAmount, amountIsValid, storageReady, onConversionChange]);

  const path = useMemo(() => buildPath(data?.series ?? []), [data?.series]);

  return (
    <div className="rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6" aria-busy={query.isFetching}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-sky-deep">
          Convert now
        </h2>
        <button
          type="button"
          aria-pressed={favorites.some((p) => p.from === from && p.to === to)}
          aria-label={favorites.some((p) => p.from === from && p.to === to) ? `Remove ${from} to ${to} from favourites` : `Save ${from} to ${to} as a favourite`}
          onClick={() => {
            const wasSaved = isFavorite({ from, to });
            setFavorites(toggleFavorite({ from, to }));
            setFavoriteStatus(wasSaved ? "Removed from favourites" : "Saved to favourites");
          }}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-sky-bright/30 text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Star className="h-5 w-5" aria-hidden="true" fill={favorites.some((p) => p.from === from && p.to === to) ? "currentColor" : "none"} />
        </button>
        <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
          {!mounted
            ? data ? `Reference rate for ${data.asOf}` : "Loading rate"
            : query.isFetching
            ? "Refreshing rate"
            : data
              ? `Updated ${timeAgo(data.fetchedAt)}`
              : query.isError
                ? "Rate service unavailable"
                : "Loading rate"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
          <div><label htmlFor="cs-amount" className="text-xs font-semibold text-muted-foreground">Amount</label>
          <div className="mt-1">
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                if (!amountIsValid) { setResultStatus("Enter a valid amount before converting."); return; }
                if (data && converted !== null) setResultStatus(`${normalizedAmount} ${from} = ${currencyFormat(converted, to)}`);
                else void query.refetch();
              }}
              id="cs-amount"
              aria-invalid={!amountIsValid}
              aria-describedby="amount-help"
              className="min-h-12 w-full rounded-xl border border-sky-bright/30 bg-background px-3 text-base font-semibold text-foreground outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div></div>
          <div><label htmlFor="cs-from" className="text-xs font-semibold text-muted-foreground">From</label><Select id="cs-from" value={from} onChange={setFrom} /></div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
            setSwapStatus(`Now converting ${to} to ${from}`);
          }}
          aria-label="Swap currencies"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-bright/30 text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
          <div><span id="cs-converted-label" className="text-xs font-semibold text-muted-foreground">Converted amount</span>
          <div className="mt-1">
            <output aria-labelledby="cs-converted-label" aria-live="polite" className="flex min-h-12 w-full items-center rounded-xl border border-sky-bright/30 bg-sky-ice/40 px-3 text-base font-bold text-foreground">
              {!amountIsValid
                ? "Enter an amount"
                : converted === null
                  ? query.isError
                    ? "Unavailable"
                    : "Loading"
                  : currencyFormat(converted, to)}
            </output>
          </div></div>
          <div><label htmlFor="cs-to" className="text-xs font-semibold text-muted-foreground">To</label><Select id="cs-to" value={to} onChange={setTo} /></div>
        </div>
      </div>

      <div role="group" aria-label="Quick amounts" className="mt-3 flex flex-wrap gap-2">{[1, 10, 100, 1000].map(n => <Button key={n} variant="outline" className="min-h-11" aria-pressed={Number(amount) === n} onClick={() => setAmount(String(n))}>{n}</Button>)}</div>
      <div role="group" aria-label="Popular pairs" className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-muted-foreground">Popular pairs</span>{[["AUD", "NPR"], ["USD", "NPR"], ["USD", "EUR"], ["EUR", "GBP"], ["USD", "JPY"], ["AUD", "USD"], ["BTC", "USD"]].map(([base, quote]) => base && quote ? <Button key={`${base}:${quote}`} variant="outline" className="min-h-11" aria-pressed={from === base && to === quote} onClick={() => { setFrom(base); setTo(quote); }}><CurrencySymbol code={base} />{base} → <CurrencySymbol code={quote} />{quote}</Button> : null)}</div>
      <div role="group" aria-label="Favourite currency pairs" className="mt-3">
        <span className="text-xs font-semibold text-muted-foreground">Favourites</span>
        {favorites.length === 0 ? (
          <p className="mt-1 text-xs text-muted-foreground">Tap the star to keep a pair here.</p>
        ) : (
          <div className="mt-1 flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap">
            {favorites.map((p) => (
              <span key={`${p.from}:${p.to}`} className="inline-flex shrink-0 items-center gap-1">
                <Button variant="outline" className="min-h-11" aria-pressed={from === p.from && to === p.to} onClick={() => { setFrom(p.from); setTo(p.to); }}><CurrencySymbol code={p.from} />{p.from} to <CurrencySymbol code={p.to} />{p.to}</Button>
                <button
                  type="button"
                  aria-label={`Remove ${p.from} to ${p.to}`}
                  onClick={() => { setFavorites(toggleFavorite(p)); setFavoriteStatus(`Removed ${p.from} to ${p.to} from favourites`); }}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-sky-bright/30 text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <p role="status" className="sr-only">{favoriteStatus}</p>
      {recent.length > 0 && <div role="group" aria-label="Recent currency pairs" className="mt-3 flex flex-wrap gap-2">{recent.map(p => <Button key={`${p.from}:${p.to}`} variant="outline" className="min-h-11" aria-pressed={from === p.from && to === p.to} onClick={() => { setFrom(p.from); setTo(p.to); }}><CurrencySymbol code={p.from} />{p.from} to <CurrencySymbol code={p.to} />{p.to}</Button>)}</div>}
      <p role="status" className="sr-only">{swapStatus}</p>
      <p id="amount-help" className="mt-2 text-xs text-muted-foreground">
        {!amountIsValid ? "Enter an amount greater than zero using digits, commas or one decimal point." : "Rates are reference values and may differ from the rate offered by a bank or exchange."}
      </p>

      <p role={query.isError && !data ? "alert" : undefined} className="mt-4 text-sm text-muted-foreground">
        {data ? (
          <>
            1 {from} = <span className="font-bold text-foreground">{currencyFormat(data.rate, to, true)}</span>
            <span className="ml-2 block text-sm sm:inline">Reference rate for {data.asOf}. Source: {data.source}</span>
            {Number.isFinite(data.rate) && data.rate > 0 && <span className="mt-1 block text-sm">1 {to} = {new Intl.NumberFormat("en-GB", { maximumFractionDigits: 8 }).format(1 / data.rate)} {from}</span>}
          </>
        ) : query.isError ? (
          <>
            I could not reach the rate service just now. The numbers stay blank rather than show
            you something stale.
            <Button variant="outline" className="ml-2 min-h-11" onClick={() => { void query.refetch(); }}>Try again</Button>
          </>
        ) : (
          <>Fetching the current rate</>
        )}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button variant="outline" className="min-h-11" disabled={!data || !amountIsValid || converted === null || !Number.isFinite(converted) || query.isError} onClick={() => {
          if (!data || !amountIsValid || converted === null || !Number.isFinite(converted) || query.isError) return;
          setSavedConversions(saveConversion({ from, to, amount: parsedAmount, result: converted, rate: data.rate, asOf: data.asOf, source: data.source, at: new Date().toISOString() }));
          setResultStatus("Conversion saved");
        }}>Save this conversion</Button>
        <Button variant="outline" className="min-h-11" disabled={!data || converted === null} onClick={async () => { if (!data || converted === null) return; try { await navigator.clipboard.writeText(`${amount} ${from} = ${currencyFormat(converted, to)}, reference rate for ${data.asOf}`); setResultStatus("Result copied"); } catch { setResultStatus("Copy unavailable in this browser"); } }}>Copy result</Button><span role="status" className="text-xs text-muted-foreground">{resultStatus}</span>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-11 items-center rounded-full border border-sky-bright/40 px-4 text-xs font-semibold text-sky-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Copy link to {from} to {to}
        </button>
        <span role="status" aria-live="polite" className="text-xs text-muted-foreground">
          {copied ? "Link copied" : ""}
        </span>
        <button
          type="button"
          onClick={() => { setDefaultPair({ from, to }); setDefaultStatus(`${from} to ${to} is now your default pair`); }}
          className="inline-flex min-h-11 items-center text-xs font-semibold text-sky-deep underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Make this my default pair
        </button>
        <span role="status" className="text-xs text-muted-foreground">{defaultStatus}</span>
      </div>

      <details className="mt-5 text-sm text-foreground">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold focus-visible:ring-2 focus-visible:ring-ring">Saved conversions</summary>
        {savedConversions.length === 0 ? <p className="mt-2 text-muted-foreground">No saved conversions yet.</p> : <ul className="mt-2 space-y-3">
          {savedConversions.map((entry, index) => <li key={`${entry.at}:${index}`}>
            <Button variant="ghost" className="h-auto min-h-11 w-full justify-start whitespace-normal px-2 py-3 text-left" onClick={() => { setFrom(entry.from); setTo(entry.to); setAmount(String(entry.amount)); setResultStatus("Saved pair and amount loaded"); }}>
              <span className="min-w-0 break-words"><span className="block font-semibold">{format(entry.amount)} {entry.from} = {currencyFormat(entry.result, entry.to)}</span><span className="mt-1 block font-normal text-muted-foreground">Rate {format(entry.rate)}, reference date <time dateTime={entry.asOf}>{entry.asOf}</time>, {entry.source}</span></span>
            </Button>
          </li>)}
        </ul>}
        <p className="mt-3 text-sm text-muted-foreground">Saved values are a record of the rate at the time you saved them. They do not update.</p>
        <Button variant="outline" className="mt-3 min-h-11" disabled={savedConversions.length === 0} onClick={() => { if (!window.confirm("Clear all saved conversions?")) return; clearSavedConversions(); setSavedConversions([]); setResultStatus("Saved conversions cleared"); }}>Clear saved</Button>
      </details>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Last 30 days
          </h3>
          <button
            type="button"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-sky-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Refresh
          </button>
        </div>
        <div className="mt-2 rounded-xl border border-sky-bright/20 bg-sky-ice/30 p-3">
          {path ? (
            <svg
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
              className="h-24 w-full"
              role="img"
              aria-label={`Trend of ${from} to ${to} over the last 30 days`}
            >
              <title>{`${from} to ${to} reference-rate trend over the last 30 days`}</title>
              <path d={path.area} fill="color-mix(in oklab, var(--sky-bright) 22%, transparent)" />
              <path
                d={path.line}
                fill="none"
                stroke="var(--sky-deep)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          ) : (
            <p className="py-6 text-center text-xs text-muted-foreground">
              {query.isLoading ? "Loading the chart" : "No history available for this pair."}
            </p>
          )}
          {data && data.series.length > 1 && (
            <p className="sr-only">
              {`From ${data.series[0]?.date} to ${data.series[data.series.length - 1]?.date}, 1 ${from} moved from ${format(data.series[0]?.value ?? 0)} to ${format(data.series[data.series.length - 1]?.value ?? 0)} ${to}, ${changeLabel(data.series)}.`}
            </p>
          )}
          {data && data.series.length > 1 && (
            <div aria-hidden="true" className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
              <span>{data.series[0]?.date}</span>
              <span className="order-3 w-full text-sm sm:order-none sm:w-auto">
                {data.approximate ? "Converted through USD. " : ""}
                {changeLabel(data.series)}
              </span>
              <span>{data.series[data.series.length - 1]?.date}</span>
            </div>
          )}
        </div>
        {data && data.series.length > 0 && (<>
          <p className="mt-3 text-xs text-muted-foreground">Period high: {format(Math.max(...data.series.map(p => p.value)))} {to}. Low: {format(Math.min(...data.series.map(p => p.value)))} {to}. Average: {format(data.series.reduce((sum, p) => sum + p.value, 0) / data.series.length)} {to}.</p>
          <details className="mt-3 text-sm text-foreground"><summary className="min-h-11 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Show the 30 day data as a table</summary>
            <table className="mt-2 w-full text-left"><caption className="text-left text-sm text-muted-foreground">Reference rates for 1 {from} in {to}</caption><thead><tr><th scope="col">Date</th><th scope="col">Rate</th></tr></thead><tbody>{data.series.map(p => <tr key={p.date}><th scope="row" className="py-1 font-normal">{p.date}</th><td>{format(p.value)}</td></tr>)}</tbody></table>
          </details>
        </>)}
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 min-h-12 w-full rounded-xl border border-sky-bright/30 bg-background px-2 text-sm font-bold text-sky-deep outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {SELECTABLE_CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {currencyFlag(c)} {c}, {CURRENCY_NAMES[c] ?? ADDITIONAL_NRB_CURRENCIES[c]}
        </option>
      ))}
    </select>
  );
}

function CurrencySymbol({ code }: { code: string }) {
  return <span aria-hidden="true" className={["BTC", "ETH", "SOL"].includes(code) ? "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs" : "inline-flex shrink-0"}>{currencyFlag(code)}</span>;
}

function format(n: number) {
  if (!isFinite(n)) return "0";
  const digits = Math.abs(n) >= 100 ? 2 : Math.abs(n) >= 1 ? 4 : 6;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function timeAgo(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  const m = Math.floor(s / 60);
  if (m < 1) return "less than a minute ago";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  return `${h} hour${h === 1 ? "" : "s"} ago`;
}

function changeLabel(series: { value: number }[]) {
  const first = series[0]?.value ?? 0;
  const last = series[series.length - 1]?.value ?? 0;
  if (first === 0) return "Change unavailable";
  const pct = ((last - first) / first) * 100;
  const dir = pct >= 0 ? "up" : "down";
  return `${dir} ${Math.abs(pct).toFixed(2)}% over the period`;
}

function buildPath(series: { value: number }[]) {
  if (series.length < 2) return null;
  const values = series.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 300;
    const y = 74 - ((v - min) / span) * 68;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return {
    line: `M ${pts.join(" L ")}`,
    area: `M 0,80 L ${pts.join(" L ")} L 300,80 Z`,
  };
}

function currencyFormat(value: number, code: string, rate = false) {
  if (["BTC", "ETH", "SOL"].includes(code)) return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, currencyDisplay: "code", ...(rate ? { minimumFractionDigits: 2, maximumFractionDigits: 6 } : {}) }).format(value);
}
