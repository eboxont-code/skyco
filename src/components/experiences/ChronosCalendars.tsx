import { useMemo, useState } from "react";

/**
 * The Chronos reading, running on skyco.online itself.
 * Pick one day and read it back in six calendar systems at once.
 */
const SYSTEMS: { label: string; calendar: string; locale: string }[] = [
  { label: "Gregorian", calendar: "gregory", locale: "en-GB" },
  { label: "Hijri", calendar: "islamic-umalqura", locale: "en-GB" },
  { label: "Hebrew", calendar: "hebrew", locale: "en-GB" },
  { label: "Chinese", calendar: "chinese", locale: "en-GB" },
  { label: "Persian", calendar: "persian", locale: "en-GB" },
  { label: "Indian Saka", calendar: "indian", locale: "en-GB" },
];

export function ChronosCalendars() {
  const [value, setValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [copyStatus, setCopyStatus] = useState("");
  const shiftDay = (offset: number) => {
    const date = new Date(`${value}T12:00:00Z`);
    if (isNaN(date.getTime())) return;
    date.setUTCDate(date.getUTCDate() + offset);
    setValue(date.toISOString().slice(0, 10));
  };
  const dateIsValid = /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(new Date(`${value}T12:00:00Z`).getTime());

  const rows = useMemo(() => {
    const date = new Date(`${value}T12:00:00Z`);
    if (isNaN(date.getTime())) return [];
    return SYSTEMS.map((s) => {
      let text = "Not available in this browser";
      try {
        text = new Intl.DateTimeFormat(`${s.locale}-u-ca-${s.calendar}`, {
          day: "numeric",
          month: "long",
          year: "numeric",
          era: s.calendar === "gregory" ? undefined : "short",
          timeZone: "UTC",
        }).format(date);
      } catch {
        /* keep the fallback text */
      }
      return { label: s.label, text };
    });
  }, [value]);

  const weekday = useMemo(() => {
    const date = new Date(`${value}T12:00:00Z`);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" }).format(date);
  }, [value]);

  return (
    <div className="rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="block"><label htmlFor="chronos-date" className="text-xs font-semibold text-muted-foreground">Pick a date</label>
          <input
            type="date"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            id="chronos-date"
            aria-invalid={!dateIsValid}
            aria-describedby="calendar-help"
            className="mt-1 block min-h-12 w-full rounded-xl border border-sky-bright/30 bg-background px-3 text-base font-semibold text-foreground outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-56"
          />
        </div>
        <button type="button" disabled={!dateIsValid} onClick={() => shiftDay(-1)} className="min-h-12 rounded-full border border-sky-bright/40 px-4 text-sm text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">Previous day</button>
        <button type="button" disabled={!dateIsValid} onClick={() => shiftDay(1)} className="min-h-12 rounded-full border border-sky-bright/40 px-4 text-sm text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">Next day</button>
        <button
          type="button"
          onClick={() => setValue(new Date().toISOString().slice(0, 10))}
          className="inline-flex min-h-12 items-center rounded-full border border-sky-bright/40 px-5 text-sm font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Today
        </button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" suppressHydrationWarning>
        {weekday ? `${weekday}, read in six systems.` : "Choose a valid date."}
      </p>

      <p id="calendar-help" className="mt-1 text-xs text-muted-foreground">
        Calendar readings use your browser&apos;s standard calendar data. Holidays and observances are not included.
      </p>

      <p className="sr-only" role="status">{dateIsValid ? `Readings updated for ${weekday}, ${value}` : "Choose a valid date."}</p>
      <button type="button" disabled={!dateIsValid} onClick={async () => { try { await navigator.clipboard.writeText(rows.map(r => `${r.label}: ${r.text}`).join("\n")); setCopyStatus("Copied"); } catch { setCopyStatus("Copy unavailable. Select the readings to copy them."); } }} className="mt-3 min-h-11 rounded-full border border-sky-bright/40 px-4 text-sm text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">Copy readings</button>
      <span role="status" className="ml-3 text-xs text-muted-foreground">{copyStatus}</span>
      <dl
        className="mt-3 grid gap-3 sm:grid-cols-2"
        aria-label={dateIsValid ? `Calendar readings for ${value}` : "Calendar readings"}
      >
        {rows.map((r) => (
          <div
            key={r.label}
            className="rounded-xl border border-sky-bright/20 bg-sky-ice/30 px-4 py-3"
          >
            <dt className="text-[11px] font-bold uppercase tracking-wider text-sky-deep">
              {r.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-foreground" suppressHydrationWarning>
              {r.text}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
