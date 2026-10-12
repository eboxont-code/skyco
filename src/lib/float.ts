// Moved from the Float app (src/lib/float.ts). Subscription helpers removed.
export const AUD = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2 });

export function formatAud(amount: number): string {
  return AUD.format(amount);
}

/** Monday-start week containing `from` (local time). */
export function weekRange(from: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
}

export function toIsoDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDayShort(iso: string): string {
  return new Intl.DateTimeFormat("en-AU", { weekday: "short", day: "numeric", month: "short" }).format(parseIso(iso));
}

export function formatRange(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short" });
  return `${fmt.format(start)} to ${fmt.format(end)}`;
}

export type Frequency = "weekly" | "fortnightly" | "monthly";
export type Period = "week" | "fortnight" | "month";

export const PERIOD_LABELS: Record<Period, string> = { week: "This week", fortnight: "Fortnight", month: "Month" };
export const FREQUENCY_LABELS: Record<Frequency, string> = { weekly: "Weekly", fortnightly: "Fortnightly", monthly: "Monthly" };

/** Start/end (inclusive) for the selected window. */
export function periodRange(period: Period, from: Date = new Date()): { start: Date; end: Date } {
  if (period === "month") {
    return { start: new Date(from.getFullYear(), from.getMonth(), 1), end: new Date(from.getFullYear(), from.getMonth() + 1, 0) };
  }
  const { start } = weekRange(from);
  const end = new Date(start);
  end.setDate(start.getDate() + (period === "fortnight" ? 13 : 6));
  return { start, end };
}

function addMonthsClamped(base: Date, months: number): Date {
  const day = base.getDate();
  const target = new Date(base.getFullYear(), base.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return target;
}

/** Every date a repeating item lands on inside [start, end]. */
export function occurrencesInRange(iso: string, frequency: Frequency, start: Date, end: Date): string[] {
  const anchor = startOfDay(parseIso(iso));
  const from = startOfDay(start);
  const to = startOfDay(end);
  const out: string[] = [];
  if (frequency === "monthly") {
    const monthsApart = (from.getFullYear() - anchor.getFullYear()) * 12 + (from.getMonth() - anchor.getMonth());
    for (let i = monthsApart - 1; i <= monthsApart + 2; i += 1) {
      const hit = addMonthsClamped(anchor, i);
      if (hit >= from && hit <= to) out.push(toIsoDate(hit));
    }
    return out;
  }
  const step = frequency === "weekly" ? 7 : 14;
  const dayDiff = Math.floor((from.getTime() - anchor.getTime()) / 86_400_000);
  let steps = Math.floor(dayDiff / step);
  if (steps < 0) steps = 0;
  for (let i = steps; i < steps + 40; i += 1) {
    const hit = new Date(anchor);
    hit.setDate(anchor.getDate() + i * step);
    if (hit > to) break;
    if (hit >= from) out.push(toIsoDate(hit));
  }
  return out;
}

export function savings(original: number | null | undefined, amount: number): number {
  if (original == null || !Number.isFinite(original)) return 0;
  return Math.max(0, Math.round((original - amount) * 100) / 100);
}

/** Days until a deal ends; null when there is no end date or it has passed. */
export function dealDaysLeft(dealEndsOn: string | null | undefined): number | null {
  if (!dealEndsOn) return null;
  const days = Math.round((startOfDay(parseIso(dealEndsOn)).getTime() - startOfDay(new Date()).getTime()) / 86_400_000);
  return days < 0 ? null : days;
}
