import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useWebMCPTools, text } from "@/lib/webmcp";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { CURRENCIES, CURRENCY_NAMES, getRate, type RateResult } from "@/lib/rates.functions";

/**
 * The CurrenSee converter, running on skyco.online itself.
 * Opens on USD to EUR with a live rate and a 30 day chart already on screen.
 */
export function CurrenSeeConverter({ initialFrom = "USD", initialTo = "EUR" }: { initialFrom?: string; initialTo?: string }) {
  const safeFrom = CURRENCIES.includes(initialFrom) ? initialFrom : "USD";
  const safeTo = CURRENCIES.includes(initialTo) ? initialTo : "EUR";
  const [from, setFrom] = useState(safeFrom);
  const [to, setTo] = useState(safeTo);
  const [amount, setAmount] = useState("100");
  const fetchRate = useServerFn(getRate);
  useWebMCPTools([{ name: "get_currency_rate", description: "Get the current reference rate for a supported currency pair.", inputSchema: { type: "object", properties: { from: { type: "string", enum: CURRENCIES }, to: { type: "string", enum: CURRENCIES } }, required: ["from", "to"], additionalProperties: false }, execute: async args => { const from = String(args.from ?? "").toUpperCase(); const to = String(args.to ?? "").toUpperCase(); if (!CURRENCIES.includes(from) || !CURRENCIES.includes(to)) return text("Choose two supported currency codes."); try { const result = await fetchRate({ data: { from, to } }); return text(`1 ${from} = ${currencyFormat(result.rate, to, true)}, reference rate for ${result.asOf}. Source: ${result.source}`); } catch { return text("Rate service unavailable. No current rate could be retrieved."); } } }]);
  const [swapStatus, setSwapStatus] = useState("");
  const [recent, setRecent] = useState<{ from: string; to: string }[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
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
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    const link = `https://skyco.online/currensee?from=${from}&to=${to}`;
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
    queryFn: () => fetchRate({ data: { from, to } }),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const data = query.data;
  const normalizedAmount = amount.replace(/,/g, "");
  const parsedAmount = Number(normalizedAmount);
  const amountIsValid = /^\d+(?:\.\d+)?$/.test(normalizedAmount) && Number.isFinite(parsedAmount) && parsedAmount > 0;
  const converted = data && amountIsValid ? parsedAmount * data.rate : null;

  const path = useMemo(() => buildPath(data?.series ?? []), [data?.series]);

  return (
    <div className="rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6" aria-busy={query.isFetching}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-sky-deep">
          Convert now
        </h2>
        <span className="text-xs text-muted-foreground" role="status" aria-live="polite" suppressHydrationWarning>
          {query.isFetching
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
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
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

      <div role="group" aria-label="Quick amounts" className="mt-3 flex flex-wrap gap-2">{[1, 10, 100, 1000].map(n => <Button key={n} variant="outline" aria-pressed={Number(amount) === n} onClick={() => setAmount(String(n))}>{n}</Button>)}</div>
      {recent.length > 0 && <div role="group" aria-label="Recent currency pairs" className="mt-3 flex flex-wrap gap-2">{recent.map(p => <Button key={`${p.from}:${p.to}`} variant="outline" aria-pressed={from === p.from && to === p.to} onClick={() => { setFrom(p.from); setTo(p.to); }}>{p.from} to {p.to}</Button>)}</div>}
      <p role="status" className="sr-only">{swapStatus}</p>
      <p id="amount-help" className="mt-2 text-xs text-muted-foreground">
        {!amountIsValid ? "Enter an amount greater than zero using digits, commas or one decimal point." : "Rates are reference values and may differ from the rate offered by a bank or exchange."}
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        {data ? (
          <>
            1 {from} = <span className="font-bold text-foreground">{currencyFormat(data.rate, to, true)}</span>
            <span className="ml-2 block text-xs sm:inline">Reference rate for {data.asOf}. Source: {data.source}</span>
          </>
        ) : query.isError ? (
          <>
            I could not reach the rate service just now. The numbers stay blank rather than show
            you something stale.
            <Button variant="outline" className="ml-2" onClick={() => { void query.refetch(); }}>Retry</Button>
          </>
        ) : (
          <>Fetching the current rate</>
        )}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
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
      </div>

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
            <div aria-hidden="true" className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>{data.series[0]?.date}</span>
              <span>
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
            <table className="mt-2 w-full text-left"><caption className="text-left text-xs text-muted-foreground">Reference rates for 1 {from} in {to}</caption><thead><tr><th scope="col">Date</th><th scope="col">Rate</th></tr></thead><tbody>{data.series.map(p => <tr key={p.date}><th scope="row" className="py-1 font-normal">{p.date}</th><td>{format(p.value)}</td></tr>)}</tbody></table>
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
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {c}, {CURRENCY_NAMES[c]}
        </option>
      ))}
    </select>
  );
}

function format(n: number) {
  if (!isFinite(n)) return "0";
  const digits = Math.abs(n) >= 100 ? 2 : Math.abs(n) >= 1 ? 4 : 6;
  return n.toLocaleString("en-US", { maximumFractionDigits: digits });
}

function timeAgo(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  return `${Math.round(s / 3600)} h ago`;
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
