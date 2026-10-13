// Moved from the Float app (src/components/float/OutgoingsChart.tsx), hub colours.
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatAud } from "@/lib/float";

const config = { value: { label: "Amount" } } as const;

export function OutgoingsChart({ income, bills, bnpl, periodLabel }: { income: number; bills: number; bnpl: number; periodLabel: string }) {
  if (income === 0 && bills === 0 && bnpl === 0) return null;
  const data = [
    { name: "Pay in", value: income, fill: "var(--color-sky-bright)" },
    { name: "Bills", value: bills, fill: "var(--color-sky-deep)" },
    { name: "BNPL", value: bnpl, fill: "var(--color-muted-foreground)" },
  ];
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-sky-bright/20 bg-card p-4 sm:p-5">
      <h3 className="text-lg font-bold text-foreground">Where it goes</h3>
      <p className="text-sm text-muted-foreground">{periodLabel}</p>
      <ChartContainer config={config} className="mt-4 h-48 w-full max-w-full overflow-hidden">
        <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis width={64} tickLine={false} axisLine={false} tickFormatter={(v: number) => formatAud(v).replace(/\.00$/, "")} />
          <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatAud(Number(v))} />} />
          <Bar dataKey="value" radius={6} />
        </BarChart>
      </ChartContainer>
    </section>
  );
}
