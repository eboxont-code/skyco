// Moved from the Float app unchanged.
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PERIOD_LABELS, type Period } from "@/lib/float";

export function PeriodTabs({ value, onChange }: { value: Period; onChange: (period: Period) => void }) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as Period)}>
      <TabsList className="w-full">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((period) => (
          <TabsTrigger key={period} value={period} className="min-h-10 flex-1">{PERIOD_LABELS[period]}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
