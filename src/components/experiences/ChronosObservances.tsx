import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CalendarSystem, Observance } from "@/lib/calendars";

function dateKey(date: Date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function downloadCalendar(event: Observance) {
  const end = new Date(event.date);
  end.setDate(end.getDate() + 1);
  const escape = (text: string) => text.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const contents = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SkyCo//Chronos//EN", "BEGIN:VEVENT", `UID:${crypto.randomUUID()}@skyco.online`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;VALUE=DATE:${dateKey(event.date)}`, `DTEND;VALUE=DATE:${dateKey(end)}`, `SUMMARY:${escape(event.label)}`, `DESCRIPTION:${escape(event.note ?? "")}`, "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
  const url = URL.createObjectURL(new Blob([contents], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `chronos-${dateKey(event.date)}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ChronosObservances({ system, value }: { system: CalendarSystem; value: string }) {
  const [events, setEvents] = useState<Observance[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setEvents(null);
    setFailed(false);
    const parsed = new Date(`${value}T12:00:00Z`);
    const anchor = new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 12);
    const timer = setTimeout(() => {
      void import("@/lib/calendars.observances").then(module => {
        const results = module.observancesForMonth(system, anchor);
        if (active) setEvents(results);
      }).catch(() => { if (active) setFailed(true); });
    }, 0);
    return () => { active = false; clearTimeout(timer); };
  }, [system, value]);
  const selected = value.replace(/-/g, "");
  const listId = `observances-${system}`;
  return <div className="mt-2 min-w-0 text-sm">
    <div className="flex flex-wrap gap-2">{events?.filter(event => dateKey(event.date) === selected).map(event => <span key={event.label} className="rounded border border-border bg-muted px-2 py-1 text-foreground">{event.label}</span>)}</div>
    <Button variant="ghost" className="min-h-11 h-auto w-full justify-start whitespace-normal px-0 text-left text-sm" aria-expanded={expanded} aria-controls={listId} onClick={() => setExpanded(!expanded)}>
      {failed ? "Could not load this month's dates." : events === null ? "Loading this month's dates" : events.length ? `${events.length} dates this month` : "No marked dates this month"}
    </Button>
    {expanded && <ul id={listId} className="space-y-3 border-t border-border pt-3">{events?.map((event, index) => <li key={`${dateKey(event.date)}-${index}`} className="min-w-0">
      <time dateTime={`${event.date.getFullYear()}-${String(event.date.getMonth()+1).padStart(2,"0")}-${String(event.date.getDate()).padStart(2,"0")}`} className="block text-muted-foreground">{event.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long" })}</time>
      <p className="font-semibold text-foreground">{event.label}</p>
      {event.note && <p className="mt-1 text-sm text-muted-foreground">{event.note}</p>}
      <Button variant="outline" className="mt-2 min-h-11 h-auto whitespace-normal" onClick={() => downloadCalendar(event)}>Add to my calendar</Button>
    </li>)}</ul>}
  </div>;
}