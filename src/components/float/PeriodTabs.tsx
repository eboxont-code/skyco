// Moved from the Float app unchanged.
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PERIOD_LABELS, type Period } from "@/lib/float";

export function PeriodTabs({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  return (
    <ToggleGroup type="single" value={value} aria-label="Planning period" className="w-full flex-wrap rounded-lg bg-muted p-1" onValueChange={(next) => { if (next in PERIOD_LABELS) onChange(next as Period); }}>
        {(Object.keys(PERIOD_LABELS) as Period[]).map((period) => (
          <ToggleGroupItem key={period} value={period} className="h-auto min-h-11 min-w-0 flex-1 whitespace-normal px-3 py-2 data-[state=on]:bg-background data-[state=on]:text-foreground">{PERIOD_LABELS[period]}</ToggleGroupItem>
        ))}
    </ToggleGroup>
  );
}
