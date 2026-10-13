// Moved from the Float app (src/components/float/EntrySection.tsx), restyled with hub tokens.
import { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dealDaysLeft, formatAud, formatDayShort, savings, FREQUENCY_LABELS, type Frequency } from "@/lib/float";

export type Entry = { id: string; name: string; amount: number; date: string; frequency: Frequency; originalAmount?: number | null; dealEndsOn?: string | null };
export type EntryDraft = Omit<Entry, "id" | "originalAmount" | "dealEndsOn"> & { originalAmount: number | null; dealEndsOn: string | null };

type Labels = { nameLabel: string; namePlaceholder: string; dateLabel: string; showDealFields?: boolean };

function EntryForm({ nameLabel, namePlaceholder, dateLabel, showDealFields, initial, submitLabel, onSubmit, onCancel }: Labels & {
  initial: EntryDraft;
  submitLabel: string;
  onSubmit: (draft: EntryDraft) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [amount, setAmount] = useState(initial.amount ? String(initial.amount) : "");
  const [date, setDate] = useState(initial.date);
  const [frequency, setFrequency] = useState<Frequency>(initial.frequency);
  const [originalAmount, setOriginalAmount] = useState(initial.originalAmount != null ? String(initial.originalAmount) : "");
  const [dealEndsOn, setDealEndsOn] = useState(initial.dealEndsOn ?? "");

  return (
    <form
      className="grid min-w-0 gap-3 rounded-xl border border-sky-bright/20 bg-sky-ice/40 p-3 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const value = Number.parseFloat(amount);
        if (!name.trim() || !Number.isFinite(value) || !date) return;
        const original = Number.parseFloat(originalAmount);
        onSubmit({
          name: name.trim(),
          amount: Math.round(value * 100) / 100,
          date,
          frequency,
          originalAmount: Number.isFinite(original) ? Math.round(original * 100) / 100 : null,
          dealEndsOn: dealEndsOn || null,
        });
      }}
    >
      <div className="grid min-w-0 gap-1.5">
        <Label className="text-xs text-muted-foreground">{nameLabel}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={namePlaceholder} required />
      </div>
      <div className="grid min-w-0 gap-1.5">
        <Label className="text-xs text-muted-foreground">Amount (AUD)</Label>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" type="number" step="0.01" min="0" placeholder="0.00" required />
      </div>
      <div className="grid min-w-0 gap-1.5">
        <Label className="text-xs text-muted-foreground">{dateLabel}</Label>
        <Input value={date} onChange={(e) => setDate(e.target.value)} type="date" required />
      </div>
      <div className="grid min-w-0 gap-1.5">
        <Label className="text-xs text-muted-foreground">Repeats</Label>
        <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((key) => (
              <SelectItem key={key} value={key}>{FREQUENCY_LABELS[key]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {showDealFields ? (
        <>
          <div className="grid min-w-0 gap-1.5">
            <Label className="text-xs text-muted-foreground">Original price (optional)</Label>
            <Input value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)} inputMode="decimal" type="number" step="0.01" min="0" placeholder="0.00" />
          </div>
          <div className="grid min-w-0 gap-1.5">
            <Label className="text-xs text-muted-foreground">Deal ends (optional)</Label>
            <Input value={dealEndsOn} onChange={(e) => setDealEndsOn(e.target.value)} type="date" />
          </div>
        </>
      ) : null}
      <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row">
        <Button type="submit" className="min-h-11"><Check className="size-4" aria-hidden="true" /> {submitLabel}</Button>
        <Button type="button" variant="ghost" className="min-h-11 w-full sm:w-auto" onClick={onCancel}><X className="size-4" aria-hidden="true" /> Cancel</Button>
      </div>
    </form>
  );
}

export function EntrySection({ title, subtitle, emptyText, total, tone, entries, defaultDate, defaultFrequency, onCreate, onUpdate, onDelete, ...labels }: Labels & {
  title: string;
  subtitle: string;
  emptyText: string;
  total: number;
  tone: "positive" | "outgoing";
  entries: Entry[];
  defaultDate: string;
  defaultFrequency: Frequency;
  onCreate: (draft: EntryDraft) => void;
  onUpdate: (id: string, draft: EntryDraft) => void;
  onDelete: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-sky-bright/20 bg-card p-4 sm:p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0 break-words">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <p className={`shrink-0 tabular-nums text-base font-semibold ${tone === "positive" ? "text-emerald-700" : "text-foreground"}`}>
          {tone === "positive" ? "+" : "-"}{formatAud(total)}
        </p>
      </header>
      <ul className="mt-4 divide-y divide-border">
        {entries.length === 0 && !adding ? (
          <li className="rounded-xl bg-muted/60 px-4 py-6 text-center text-sm text-muted-foreground">{emptyText}</li>
        ) : null}
        {entries.map((entry) => {
          const saved = savings(entry.originalAmount, entry.amount);
          const endsIn = dealDaysLeft(entry.dealEndsOn);
          if (editingId === entry.id) {
            return (
              <li key={`${entry.id}-${entry.date}`} className="py-3">
                <EntryForm
                  {...labels}
                  initial={{ name: entry.name, amount: entry.amount, date: entry.date, frequency: entry.frequency, originalAmount: entry.originalAmount ?? null, dealEndsOn: entry.dealEndsOn ?? null }}
                  submitLabel="Save"
                  onSubmit={(draft) => { onUpdate(entry.id, draft); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            );
          }
          return (
            <li key={`${entry.id}-${entry.date}`} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3">
              <div className="min-w-0 flex-1 basis-40">
                <p className="break-words font-medium text-foreground">{entry.name}</p>
                <p className="text-sm text-muted-foreground">{formatDayShort(entry.date)}, {FREQUENCY_LABELS[entry.frequency].toLowerCase()}</p>
                {endsIn !== null ? (
                  <p className={`mt-1 text-xs ${endsIn <= 7 ? "font-medium text-destructive" : "text-muted-foreground"}`}>
                    {endsIn === 0 ? "Deal ends today" : `Deal ends in ${endsIn} ${endsIn === 1 ? "day" : "days"}`}
                  </p>
                ) : null}
              </div>
              <div className="ml-auto flex min-w-0 items-center gap-1">
                <span className="mr-1 min-w-0 text-right">
                  <span className="block font-semibold tabular-nums">{formatAud(entry.amount)}</span>
                  {saved > 0 ? (
                    <span className="block text-xs tabular-nums text-muted-foreground"><s>{formatAud(entry.originalAmount ?? 0)}</s> save {formatAud(saved)}</span>
                  ) : null}
                </span>
                <Button variant="ghost" size="icon" className="size-11" aria-label={`Edit ${entry.name}`} onClick={() => setEditingId(entry.id)}><Pencil className="size-4" /></Button>
                <Button variant="ghost" size="icon" className="size-11" aria-label={`Delete ${entry.name}`} onClick={() => onDelete(entry.id)}><Trash2 className="size-4" /></Button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        {adding ? (
          <EntryForm
            {...labels}
            initial={{ name: "", amount: 0, date: defaultDate, frequency: defaultFrequency, originalAmount: null, dealEndsOn: null }}
            submitLabel="Add"
            onSubmit={(draft) => { onCreate(draft); setAdding(false); }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <Button variant="secondary" className="min-h-11 w-full whitespace-normal break-words sm:w-auto" onClick={() => setAdding(true)}><Plus className="size-4" aria-hidden="true" /> Add {title.toLowerCase()}</Button>
        )}
      </div>
    </section>
  );
}
