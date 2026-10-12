// Moved from the Float app (src/components/float/ExpiryAlerts.tsx).
import { AlarmClock } from "lucide-react";
import { dealDaysLeft, formatAud, formatDayShort } from "@/lib/float";
import type { Entry } from "@/components/float/EntrySection";

export function ExpiryAlerts({ items }: { items: Entry[] }) {
  const ending = items
    .map((item) => ({ item, days: dealDaysLeft(item.dealEndsOn) }))
    .filter((row): row is { item: Entry; days: number } => row.days !== null && row.days <= 7)
    .sort((a, b) => a.days - b.days);
  if (ending.length === 0) return null;
  return (
    <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlarmClock className="size-4" aria-hidden="true" />
        {ending.length === 1 ? "1 deal ends soon" : `${ending.length} deals end soon`}
      </h3>
      <ul className="mt-3 grid gap-2">
        {ending.map(({ item, days }) => (
          <li key={`${item.id}-${item.dealEndsOn}`} className="flex justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-foreground">
              {item.name}
              <span className="text-muted-foreground">
                {", "}{days === 0 ? "ends today" : `ends in ${days} ${days === 1 ? "day" : "days"}`}
                {item.dealEndsOn ? ` (${formatDayShort(item.dealEndsOn)})` : ""}
              </span>
            </span>
            <span className="shrink-0 font-medium tabular-nums">{formatAud(item.amount)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">Check the price before it rolls over, then update the amount here once you know the new one.</p>
    </section>
  );
}
