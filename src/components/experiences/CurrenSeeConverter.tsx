import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { CURRENCIES, getRate, type RateResult } from "@/lib/rates.functions";

/**
 * The CurrenSee converter, running on skyco.online itself.
 * Opens on USD to EUR with a live rate and a 30 day chart already on screen.
 */
export function CurrenSeeConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("100");
  const fetchRate = useServerFn(getRate);

  const query = useQuery<RateResult>({
    queryKey: ["rate", from, to],
    queryFn: () => fetchRate({ data: { from, to } }),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  const data = query.data;
  const value = Number(amount.replace(/,/g, "")) || 0;
  const converted = data ? value * data.rate : null;

  const path = useMemo(() => buildPath(data?.series ?? []), [data?.series]);

  return (
    <div className="rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-sky-deep">
          Convert now
        </h2>
        <span className="text-xs text-muted-foreground" suppressHydrationWarning>
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
        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">Amount</span>
          <div className="mt-1 flex gap-2">
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="Amount to convert"
              className="min-h-12 w-full rounded-xl border border-sky-bright/30 bg-background px-3 text-base font-semibold text-foreground outline-none focus:border-sky-bright"
            />
            <Select value={from} onChange={setFrom} label="Convert from" />
          </div>
        </label>

        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          aria-label="Swap currencies"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-bright/30 text-sky-deep transition-colors hover:bg-sky-ice"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground">Converted</span>
          <div className="mt-1 flex gap-2">
            <output className="flex min-h-12 w-full items-center rounded-xl border border-sky-bright/30 bg-sky-ice/40 px-3 text-base font-bold text-foreground">
              {converted === null ? "Loading" : format(converted)}
            </output>
            <Select value={to} onChange={setTo} label="Convert to" />
          </div>
        </label>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {data ? (
          <>
            1 {from} = <span className="font-bold text-foreground">{format(data.rate)}</span> {to}
            <span className="ml-2 text-xs">Reference rate for {data.asOf}</span>
          </>
        ) : query.isError ? (
          <>
            I could not reach the rate service just now. The numbers stay blank rather than show
            you something stale. Try refreshing in a moment.
          </>
        ) : (
          <>Fetching the current rate</>
        )}
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Last 30 days
          </h3>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-sky-deep"
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
              <path d={path.area} fill="hsl(var(--sky-bright) / 0.18)" />
              <path
                d={path.line}
                fill="none"
                stroke="hsl(var(--sky-deep))"
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
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              <span>{data.series[0]!.date}</span>
              <span>
                {data.approximate ? "Converted through USD. " : ""}
                {changeLabel(data.series)}
              </span>
              <span>{data.series[data.series.length - 1]!.date}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-12 rounded-xl border border-sky-bright/30 bg-background px-2 text-sm font-bold text-sky-deep outline-none focus:border-sky-bright"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {c}
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
  const first = series[0]!.value;
  const last = series[series.length - 1]!.value;
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
