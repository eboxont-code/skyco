import { useWebMCPTools, text } from "@/lib/webmcp";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCalendar, nativeCalendarLabel, type CalendarSystem } from "@/lib/calendars";
import { ChronosObservances } from "./ChronosObservances";

/**
 * The Chronos reading, running on skyco.online itself.
 * Pick one day and read it back in seven calendar systems at once.
 */
const SYSTEMS: {
  label: string;
  calendar: string;
  locale: string;
  system?: CalendarSystem;
  lang?: string;
  dir?: "rtl" | "ltr";
}[] = [
  { label: "Gregorian", calendar: "gregory", locale: "en-GB", system: "gregorian" },
  {
    label: "Nepali (Bikram Sambat)",
    calendar: "nepali",
    locale: "ne",
    system: "nepali",
    lang: "ne",
    dir: "ltr",
  },
  {
    label: "Hijri",
    calendar: "islamic-umalqura",
    locale: "en-GB",
    system: "hijri",
    lang: "ar",
    dir: "rtl",
  },
  {
    label: "Hebrew",
    calendar: "hebrew",
    locale: "en-GB",
    system: "hebrew",
    lang: "he",
    dir: "rtl",
  },
  {
    label: "Chinese",
    calendar: "chinese",
    locale: "en-GB",
    system: "chinese",
    lang: "zh",
    dir: "ltr",
  },
  {
    label: "Persian",
    calendar: "persian",
    locale: "en-GB",
    system: "persian",
    lang: "fa",
    dir: "rtl",
  },
  { label: "Indian Saka", calendar: "indian", locale: "en-GB" },
];

export function ChronosCalendars({ initialDate }: { initialDate?: string }) {
  const navigate = useNavigate({ from: "/chronos" });
  useWebMCPTools([
    {
      name: "read_date_in_calendars",
      description:
        "Read a date in Gregorian, Nepali, Hijri, Hebrew, Chinese, Persian and Indian Saka calendars.",
      inputSchema: {
        type: "object",
        properties: { date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" } },
        required: ["date"],
        additionalProperties: false,
      },
      execute: async (args) => {
        const value = String(args.date ?? "");
        const date = new Date(`${value}T12:00:00Z`);
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
          !Number.isFinite(date.getTime()) ||
          date.toISOString().slice(0, 10) !== value
        )
          return text("Choose a valid YYYY-MM-DD date.");
        return text(
          SYSTEMS.map((s) => {
            try {
              if (s.system === "nepali")
                return `${s.label}: ${formatCalendar("nepali", new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12))}`;
              return `${s.label}: ${new Intl.DateTimeFormat(`${s.locale}-u-ca-${s.calendar}`, { day: "numeric", month: "long", year: "numeric", era: s.calendar === "gregory" ? undefined : "short", timeZone: "UTC" }).format(date)}`;
            } catch {
              return `${s.label}: Not available in this browser`;
            }
          }).join("\n"),
        );
      },
    },
  ]);
  const [value, setValue] = useState(() => initialDate ?? new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [birth, setBirth] = useState("");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const shiftDay = (offset: number) => {
    const date = new Date(`${value}T12:00:00Z`);
    if (isNaN(date.getTime())) return;
    date.setUTCDate(date.getUTCDate() + offset);
    setValue(date.toISOString().slice(0, 10));
  };
  const dateIsValid =
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(new Date(`${value}T12:00:00Z`).getTime()) &&
    new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
  const [lastValid, setLastValid] = useState(value);
  useEffect(() => {
    if (dateIsValid) setLastValid(value);
  }, [value, dateIsValid]);
  const readingDate = dateIsValid ? value : lastValid;
  useEffect(() => {
    if (!dateIsValid || new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) !== value) return;
    if (new URLSearchParams(window.location.search).get("date") === value) return;
    void navigate({ search: { date: value }, replace: true, resetScroll: false });
  }, [value, dateIsValid, navigate]);

  const rows = useMemo(() => {
    const date = new Date(`${readingDate}T12:00:00Z`);
    return SYSTEMS.map((s) => {
      let text = "Not available for this date";
      let native: string | null = null;
      try {
        const localDate = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          12,
        );
        if (s.system) native = nativeCalendarLabel(s.system, localDate);
        text =
          s.system === "nepali"
            ? formatCalendar("nepali", localDate)
            : new Intl.DateTimeFormat(`${s.locale}-u-ca-${s.calendar}`, {
                day: "numeric",
                month: "long",
                year: "numeric",
                era: s.calendar === "gregory" ? undefined : "short",
                timeZone: "UTC",
              }).format(date);
      } catch {
        /* keep the fallback text */
      }
      return { label: s.label, text, native, lang: s.lang, dir: s.dir, system: s.system };
    });
  }, [readingDate]);

  const weekday = useMemo(() => {
    const date = new Date(`${value}T12:00:00Z`);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "UTC" }).format(date);
  }, [value]);

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-auto">
          <label htmlFor="chronos-date" className="text-xs font-semibold text-muted-foreground">
            Pick a date
          </label>
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
        <Button
          variant="outline"
          size="icon"
          disabled={!dateIsValid}
          onClick={() => shiftDay(-1)}
          aria-label="Previous day"
          title="Previous day"
          className="min-h-12 min-w-12"
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={!dateIsValid}
          onClick={() => shiftDay(1)}
          aria-label="Next day"
          title="Next day"
          className="min-h-12 min-w-12"
        >
          <ChevronRight aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            setValue(new Date().toISOString().slice(0, 10));
            setCopyStatus("Date reset to today");
          }}
          className="inline-flex min-h-12 items-center rounded-full border border-sky-bright/40 px-5 text-sm font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Today
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={!dateIsValid}
          className="min-h-12 rounded-full px-5"
          onClick={async () => {
            const url = `https://skyco.online/chronos?date=${value}`;
            try {
              if (typeof navigator.share === "function") {
                await navigator.share({ title: "Chronos date reading", url });
                return;
              }
              await navigator.clipboard.writeText(url);
              setCopyStatus("Link copied");
            } catch (err) {
              if (err instanceof DOMException && err.name === "AbortError") return;
              window.prompt("Copy this link", url);
            }
          }}
        >
          Share this date
        </Button>
        <Button
          variant="outline"
          className="min-h-12"
          disabled={!dateIsValid}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`https://skyco.online/chronos?date=${value}`);
              setCopyStatus("Link copied");
            } catch {
              setCopyStatus("Copy unavailable in this browser.");
            }
          }}
        >
          Copy link
        </Button>
      </div>

      {!dateIsValid && (
        <p role="alert" className="text-sm text-foreground">
          Choose a valid date. The last valid readings are still shown.
        </p>
      )}

      <p className="mt-4 text-sm text-muted-foreground" suppressHydrationWarning>
        {weekday ? `${weekday}, read in seven systems.` : "Choose a valid date."}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="chronos-end-date" className="text-sm font-semibold text-foreground">
            Days between
          </label>
          <input
            id="chronos-end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block min-h-11 rounded-lg border border-input bg-background px-3 text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p role="status" className="mt-2 text-sm text-muted-foreground">
            {dateIsValid &&
            /^\d{4}-\d{2}-\d{2}$/.test(endDate) &&
            Number.isFinite(new Date(`${endDate}T12:00:00Z`).getTime())
              ? `${Math.round((new Date(`${endDate}T12:00:00Z`).getTime() - new Date(`${value}T12:00:00Z`).getTime()) / 86400000)} days from ${value} to ${endDate}`
              : "Choose a second date."}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Age on this date</p>
          <label htmlFor="chronos-birth" className="mt-1 block text-xs text-muted-foreground">
            Date of birth
          </label>
          <input
            id="chronos-birth"
            type="date"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="mt-1 block min-h-11 rounded-lg border border-input bg-background px-3 text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p role="status" className="mt-2 text-sm text-muted-foreground">
            {dateIsValid ? ageText(birth, value) : "Choose a valid date."}
          </p>
        </div>
      </div>
      <p id="calendar-help" className="mt-1 text-xs text-muted-foreground">
        Hijri uses the Umm al-Qura arithmetic method, so a local moon sighting can move a date by
        one day. Dashain, Tihar, Shivaratri and other Nepali lunar festivals are computed from the
        tithi at sunrise in Kathmandu, so a local panchang can differ by a day.
      </p>

      <p className="sr-only" role="status">
        {dateIsValid ? `Readings updated for ${weekday}, ${value}` : "Choose a valid date."}
      </p>
      <button
        type="button"
        disabled={!dateIsValid}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              rows.map((r) => `${r.label}: ${r.text}`).join("\n"),
            );
            setCopyStatus("Copied");
          } catch {
            setCopyStatus("Copy unavailable. Select the readings to copy them.");
          }
        }}
        className="mt-3 min-h-11 rounded-full border border-sky-bright/40 px-4 text-sm text-sky-deep focus-visible:ring-2 focus-visible:ring-ring"
      >
        Copy readings
      </button>
      <span role="status" className="ml-3 text-xs text-muted-foreground">
        {copyStatus}
      </span>
      <dl
        className="mt-3 grid gap-3 sm:grid-cols-2"
        aria-label={dateIsValid ? `Calendar readings for ${value}` : "Calendar readings"}
      >
        {rows.map((r) => (
          <div key={r.label} className="min-w-0 rounded-lg border border-border bg-card px-4 py-3">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-sky-deep">
              {r.label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-foreground" suppressHydrationWarning>
              {r.text}
              {hydrated && r.native && (
                <span
                  lang={r.lang}
                  dir={r.dir}
                  className="mt-1 block text-sm text-muted-foreground"
                >
                  {r.native}
                </span>
              )}
              {r.label === "Gregorian" && (
                <span className="mt-1 block text-sm text-muted-foreground">
                  {ordinalSummary(readingDate)}
                </span>
              )}
              {r.system && <ChronosObservances system={r.system} value={readingDate} />}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ageText(birth: string, on: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return "Enter a date of birth.";
  const [by, bm, bd] = birth.split("-").map(Number) as [number, number, number];
  const [oy, om, od] = on.split("-").map(Number) as [number, number, number];
  const b = Date.UTC(by, bm - 1, bd, 12),
    o = Date.UTC(oy, om - 1, od, 12);
  if (!Number.isFinite(b)) return "Enter a date of birth.";
  if (b > o) return "Date of birth is after the selected date.";
  let years = oy - by,
    months = om - bm,
    days = od - bd;
  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(oy, om - 1, 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const total = Math.round((o - b) / 86400000);
  const p = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  return `${p(years, "year")}, ${p(months, "month")}, ${p(days, "day")}. ${total.toLocaleString("en-US")} days in total.`;
}

function ordinalSummary(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  const day = Math.floor((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / 86400000) + 1;
  const thursday = new Date(date);
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const week = Math.ceil(
    ((thursday.getTime() - Date.UTC(thursday.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7,
  );
  return `Day ${day} of the year. ISO week ${week}.`;
}
