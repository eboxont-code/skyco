// Float on skyco.online. Moved from the Float app's /peek page: same sums, same entry
// sections, period tabs, deal alerts, chart and share link. Accounts and checkout
// are not part of the hub: guest mode keeps numbers in this browser only, and
// saving to an account is shown as coming soon with the hub waitlist.
import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WaitlistForm } from "@/components/WaitlistForm";
import { EntrySection, type Entry, type EntryDraft } from "@/components/float/EntrySection";
import { PeriodTabs } from "@/components/float/PeriodTabs";
import { ExpiryAlerts } from "@/components/float/ExpiryAlerts";
import { OutgoingsChart } from "@/components/float/OutgoingsChart";
import { decodeFloatShare, encodeFloatShare, type SharePayload } from "@/lib/float-share";
import { clearGuest, readGuest, saveGuest } from "@/lib/float-guest";
import {
  formatAud,
  formatRange,
  occurrencesInRange,
  periodRange,
  toIsoDate,
  PERIOD_LABELS,
  type Period,
} from "@/lib/float";

type Store = { income: Entry[]; bills: Entry[]; bnpl: Entry[] };
type Bucket = keyof Store;
const NUDGE_AFTER = 3;

const makeId = () => Math.random().toString(36).slice(2);
const withIds = (p: SharePayload): Store => ({
  income: p.income.map((r) => ({ id: makeId(), ...r })),
  bills: p.bills.map((r) => ({ id: makeId(), ...r })),
  bnpl: p.bnpl.map((r) => ({ id: makeId(), ...r })),
});
const strip = (s: Store): SharePayload => {
  const rows = (list: Entry[]) => list.map(({ id: _id, ...rest }) => rest);
  return { income: rows(s.income), bills: rows(s.bills), bnpl: rows(s.bnpl) };
};

/** Sample numbers so the page shows a worked example before anything is typed. */
function sample(): Store {
  const monday = periodRange("week").start;
  const iso = (offset: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return toIsoDate(d);
  };
  return {
    income: [{ id: makeId(), name: "Wages", amount: 1420, date: iso(3), frequency: "fortnightly" }],
    bills: [
      { id: makeId(), name: "Rent", amount: 620, date: iso(0), frequency: "weekly" },
      {
        id: makeId(),
        name: "Mobile plan",
        amount: 39,
        date: iso(5),
        frequency: "monthly",
        originalAmount: 55,
        dealEndsOn: iso(4),
      },
      { id: makeId(), name: "Internet", amount: 79, date: iso(6), frequency: "monthly" },
    ],
    bnpl: [{ id: makeId(), name: "Afterpay", amount: 62, date: iso(2), frequency: "fortnightly" }],
  };
}

export function FloatPlanner({
  shared,
  initialPeriod = "week",
  bnplFirst = false,
  showCommitted = false,
}: {
  shared?: string;
  initialPeriod?: Period;
  bnplFirst?: boolean;
  showCommitted?: boolean;
}) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [store, setStore] = useState<Store>(() => {
    const fromLink = decodeFloatShare(shared);
    return fromLink ? withIds(fromLink) : sample();
  });
  const [guest, setGuest] = useState(false);
  const [edits, setEdits] = useState(0);
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle");
  const { start, end } = periodRange(period);
  const today = toIsoDate(new Date());

  // Guest mode: restore numbers kept in this browser (after hydration, never on the server).
  useEffect(() => {
    const kept = readGuest();
    if (!kept || shared) return;
    setGuest(true);
    setStore(withIds(kept));
  }, [shared]);

  useEffect(() => {
    if (guest) saveGuest(strip(store));
  }, [guest, store]);

  function startGuest() {
    saveGuest(strip(store));
    setGuest(true);
  }

  function stopGuest() {
    clearGuest();
    setGuest(false);
    setStore(sample());
    setEdits(0);
  }

  async function share() {
    const url = `${window.location.origin}/float?d=${encodeFloatShare(strip(store))}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Float numbers", url });
        setShareState("idle");
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareState("copied");
    } catch {
      setShareState("failed");
    }
  }

  const handlers = (bucket: Bucket) => ({
    onCreate: (draft: EntryDraft) => {
      setStore((s) => ({ ...s, [bucket]: [...s[bucket], { id: makeId(), ...draft }] }));
      setEdits((n) => n + 1);
    },
    onUpdate: (id: string, draft: EntryDraft) => {
      setStore((s) => ({
        ...s,
        [bucket]: s[bucket].map((e) => (e.id === id ? { ...e, ...draft } : e)),
      }));
      setEdits((n) => n + 1);
    },
    onDelete: (id: string) => {
      setStore((s) => ({ ...s, [bucket]: s[bucket].filter((e) => e.id !== id) }));
      setEdits((n) => n + 1);
    },
  });

  const expand = (entries: Entry[]) =>
    entries.flatMap((entry) =>
      occurrencesInRange(entry.date, entry.frequency, start, end).map((date) => ({
        ...entry,
        date,
      })),
    );
  const sum = (rows: Entry[]) => rows.reduce((t, r) => t + r.amount, 0);
  const income = expand(store.income).sort((a, b) => a.date.localeCompare(b.date));
  const bills = expand(store.bills).sort((a, b) => b.amount - a.amount);
  const bnpl = expand(store.bnpl).sort((a, b) => b.amount - a.amount);
  const incomeTotal = sum(income);
  const billsTotal = sum(bills);
  const bnplTotal = sum(bnpl);
  const spendable = incomeTotal - billsTotal - bnplTotal;
  const windowLabel = `${PERIOD_LABELS[period]}, ${formatRange(start, end)}`;
  const deals = [...store.bills, ...store.bnpl];

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl overflow-x-hidden">
      <div className="flex flex-col gap-3 rounded-xl border border-sky-bright/20 bg-sky-ice/50 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="min-w-0 break-words">
          {guest
            ? "Guest mode: your numbers are kept in this browser only. Nothing is sent to SkyCo."
            : "Sneak peek: sample numbers you can change. Nothing is saved unless you turn on guest mode."}
        </p>
        {guest ? (
          <Button
            variant="ghost"
            className="min-h-11 w-full whitespace-normal sm:w-auto sm:shrink-0"
            onClick={stopGuest}
          >
            Clear my numbers
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="min-h-11 w-full whitespace-normal sm:w-auto sm:shrink-0"
            onClick={startGuest}
          >
            Keep my numbers as a guest
          </Button>
        )}
      </div>

      <div className="mt-5">
        <PeriodTabs value={period} onChange={setPeriod} />
      </div>

      <section className="mt-6 text-center" aria-live="polite">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">{windowLabel}</p>
        <p
          className={`mt-3 break-words text-4xl font-extrabold tabular-nums sm:text-6xl ${spendable < 0 ? "text-destructive" : "text-sky-deep"}`}
        >
          {formatAud(spendable)}
        </p>
        <p className="mt-3 text-sm tabular-nums text-muted-foreground">
          {formatAud(incomeTotal)} in, minus {formatAud(billsTotal)} bills and{" "}
          {formatAud(bnplTotal)} BNPL
        </p>
        {showCommitted && incomeTotal > 0 && (
          <p className="mt-2 text-sm tabular-nums text-muted-foreground">
            Committed: {formatAud(billsTotal + bnplTotal)} of {formatAud(incomeTotal)},{" "}
            {Math.round(((billsTotal + bnplTotal) / incomeTotal) * 100)}%
          </p>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="mt-2 min-h-11"
              aria-label="Share these numbers with a link"
            >
              {shareState === "copied" ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Share2 className="size-4" aria-hidden="true" />
              )}
              {shareState === "copied" ? "Link copied" : "Share these numbers"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%_-_2rem)] overflow-y-auto rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Share these figures?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 text-left" asChild>
                <div>
                  <p>
                    The link will contain the selected income, bills and BNPL figures: names,
                    amounts, dates, recurrence, and any optional original amounts or deal-end dates.
                    This includes sample figures if you are using sample mode.
                  </p>
                  <p>
                    The payload uses Base64 URL-safe encoding, not encryption. Anyone with the link
                    can read those details and copy or forward it.
                  </p>
                  <p>If opened, the URL may appear in browser history or server logs.</p>
                  <p>
                    Continue to create the link and open your device's share sheet, or copy it if
                    sharing is unavailable.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="min-h-11">Cancel</AlertDialogCancel>
              <AlertDialogAction className="min-h-11 h-auto whitespace-normal" onClick={share}>
                I understand, create link
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
          Share links contain your income, bills and BNPL figures. Base64 is not encryption. Anyone
          with the link can read them, copy or forward it; opened links may be logged.
        </p>
        {shareState === "failed" ? (
          <p className="text-xs text-destructive" role="alert">
            The link could not be copied. Please try again.
          </p>
        ) : null}
      </section>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-5">
        {!guest && edits >= NUDGE_AFTER ? (
          <div className="rounded-2xl border border-sky-bright/25 bg-sky-ice/50 p-5 text-center">
            <p className="font-semibold text-foreground">Keep these numbers?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Guest mode saves them in this browser so they are here next time. No account needed.
            </p>
            <Button className="mt-3 min-h-11" onClick={startGuest}>
              Keep my numbers as a guest
            </Button>
          </div>
        ) : null}
        <ExpiryAlerts items={deals} />
        <OutgoingsChart
          income={incomeTotal}
          bills={billsTotal}
          bnpl={bnplTotal}
          periodLabel={windowLabel}
        />
        <EntrySection
          title="Income"
          subtitle="Pay landing in this window"
          nameLabel="Source"
          namePlaceholder="Wages"
          dateLabel="Pay date"
          emptyText="Add a pay to see your number."
          tone="positive"
          total={incomeTotal}
          entries={income}
          defaultDate={today}
          defaultFrequency="fortnightly"
          {...handlers("income")}
        />
        {bnplFirst && (
          <EntrySection
            title="Afterpay and BNPL"
            subtitle="Instalments and plans"
            nameLabel="Provider or plan"
            namePlaceholder="Afterpay"
            dateLabel="Due date"
            emptyText="Add an instalment to include it."
            tone="outgoing"
            total={bnplTotal}
            entries={bnpl}
            defaultDate={today}
            defaultFrequency="fortnightly"
            showDealFields
            {...handlers("bnpl")}
          />
        )}
        <EntrySection
          title="Bills due"
          subtitle="Biggest first"
          nameLabel="Bill"
          namePlaceholder="Mobile plan"
          dateLabel="Due date"
          emptyText="Add a bill such as rent, power or internet."
          tone="outgoing"
          total={billsTotal}
          entries={bills}
          defaultDate={today}
          defaultFrequency="monthly"
          showDealFields
          {...handlers("bills")}
        />
        {!bnplFirst && (
          <EntrySection
            title="Afterpay and BNPL"
            subtitle="Instalments and plans"
            nameLabel="Provider or plan"
            namePlaceholder="Afterpay"
            dateLabel="Due date"
            emptyText="Add an instalment to include it."
            tone="outgoing"
            total={bnplTotal}
            entries={bnpl}
            defaultDate={today}
            defaultFrequency="fortnightly"
            showDealFields
            {...handlers("bnpl")}
          />
        )}
        <div className="min-w-0 rounded-2xl border border-sky-bright/20 bg-card p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-deep">Coming soon</p>
          <p className="mt-1 font-semibold text-foreground">
            Float accounts and sync across your devices
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything above is free to use now. Saving to an account is not available yet. Join the
            waitlist and I will email you when it opens.
          </p>
          <WaitlistForm productName="Float" />
        </div>
      </div>
    </div>
  );
}
