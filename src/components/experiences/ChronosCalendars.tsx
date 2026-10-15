import { useWebMCPTools, text } from "@/lib/webmcp";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

export function ChronosCalendars({ initialDate }: { initialDate?: string }) {
  const navigate = useNavigate({ from: "/chronos" });
  useWebMCPTools([{ name: "read_date_in_calendars", description: "Read a date in Gregorian, Hijri, Hebrew, Chinese, Persian and Indian Saka calendars.", inputSchema: { type: "object", properties: { date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" } }, required: ["date"], additionalProperties: false }, execute: async args => { const value = String(args.date ?? ""); const date = new Date(`${value}T12:00:00Z`); if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return text("Choose a valid YYYY-MM-DD date."); return text(SYSTEMS.map(s => { try { return `${s.label}: ${new Intl.DateTimeFormat(`${s.locale}-u-ca-${s.calendar}`, { day: "numeric", month: "long", year: "numeric", era: s.calendar === "gregory" ? undefined : "short", timeZone: "UTC" }).format(date)}`; } catch { return `${s.label}: Not available in this browser`; } }).join("\n")); } }]);
  const [value, setValue] = useState(() => initialDate ?? new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const shiftDay = (offset: number) => {
    const date = new Date(`${value}T12:00:00Z`);
    if (isNaN(date.getTime())) return;
    date.setUTCDate(date.getUTCDate() + offset);
    setValue(date.toISOString().slice(0, 10));
  };
  const dateIsValid = /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(`${value}T12:00:00Z`).getTime()) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
  useEffect(() => {
    if (!dateIsValid || new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) !== value) return;
    if (new URLSearchParams(window.location.search).get("date") === value) return;
    void navigate({ search: { date: value }, replace: true, resetScroll: false });
  }, [value, dateIsValid, navigate]);

  const rows = useMemo(() => {
    const date = new Date(`${value}T12:00:00Z`);
    if (!dateIsValid) return [];
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
  }, [value, dateIsValid]);

  const weekday = useMemo(() => {
    const date = new Date(`${value}T12:00:00Z`);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" }).format(date);
  }, [value]);

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-auto"><label htmlFor="chronos-date" className="text-xs font-semibold text-muted-foreground">Pick a date</label>
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
        <Button variant="outline" size="icon" disabled={!dateIsValid} onClick={() => shiftDay(-1)} aria-label="Previous day" title="Previous day" className="min-h-12 min-w-12"><ChevronLeft aria-hidden="true" /></Button>
        <Button variant="outline" size="icon" disabled={!dateIsValid} onClick={() => shiftDay(1)} aria-label="Next day" title="Next day" className="min-h-12 min-w-12"><ChevronRight aria-hidden="true" /></Button>
        <Button variant="outline"
          type="button"
          onClick={() => { setValue(new Date().toISOString().slice(0, 10)); setCopyStatus("Date reset to today"); }}
          className="inline-flex min-h-12 items-center rounded-full border border-sky-bright/40 px-5 text-sm font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Today
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground" suppressHydrationWarning>
        {weekday ? `${weekday}, read in six systems.` : "Choose a valid date."}
      </p>

      <div className="mt-4"><label htmlFor="chronos-end-date" className="text-sm font-semibold text-foreground">Days between</label><input id="chronos-end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block min-h-11 rounded-lg border border-input bg-background px-3 text-foreground focus-visible:ring-2 focus-visible:ring-ring" /><p role="status" className="mt-2 text-sm text-muted-foreground">{dateIsValid && /^\d{4}-\d{2}-\d{2}$/.test(endDate) && Number.isFinite(new Date(`${endDate}T12:00:00Z`).getTime()) ? `${Math.round((new Date(`${endDate}T12:00:00Z`).getTime() - new Date(`${value}T12:00:00Z`).getTime()) / 86400000)} days from ${value} to ${endDate}` : "Choose a second date."}</p></div>
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
            className="min-w-0 rounded-lg border border-border bg-card px-4 py-3"
          >
            <dt className="text-[11px] font-bold uppercase tracking-wider text-sky-deep">
              {r.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-foreground" suppressHydrationWarning>
              {r.text}
              {r.label === "Gregorian" && dateIsValid && <span className="mt-1 block text-xs text-muted-foreground">{ordinalSummary(value)}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ordinalSummary(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  const day = Math.floor((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / 86400000) + 1;
  const thursday = new Date(date);
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const week = Math.ceil(((thursday.getTime() - Date.UTC(thursday.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
  return `Day ${day} of the year. ISO week ${week}.`;
}
