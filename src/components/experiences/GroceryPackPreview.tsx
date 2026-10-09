import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer } from "lucide-react";

/**
 * The Grocery Packs preview, running on skyco.online itself.
 * Open a pack and the shopping is already grouped by store section.
 */
type Pack = {
  id: string;
  name: string;
  note: string;
  sections: { name: string; items: { item: string; two: string; four: string }[] }[];
};

const PACKS: Pack[] = [
  {
    id: "easy-week",
    name: "Easy Week",
    note: "Five simple dinners, one shop, nothing exotic.",
    sections: [
      {
        name: "Produce",
        items: [
          { item: "Onions", two: "3", four: "5" },
          { item: "Carrots", two: "500 g", four: "1 kg" },
          { item: "Baby spinach", two: "200 g", four: "400 g" },
          { item: "Tomatoes", two: "6", four: "10" },
          { item: "Lemons", two: "2", four: "3" },
        ],
      },
      {
        name: "Meat and fish",
        items: [
          { item: "Chicken thighs", two: "600 g", four: "1.2 kg" },
          { item: "Salmon fillets", two: "2", four: "4" },
        ],
      },
      {
        name: "Dairy and chilled",
        items: [
          { item: "Milk", two: "1 L", four: "2 L" },
          { item: "Greek yoghurt", two: "500 g", four: "1 kg" },
          { item: "Cheddar", two: "200 g", four: "400 g" },
        ],
      },
      {
        name: "Pantry",
        items: [
          { item: "Rice", two: "500 g", four: "1 kg" },
          { item: "Pasta", two: "500 g", four: "1 kg" },
          { item: "Chopped tomatoes", two: "2 tins", four: "4 tins" },
          { item: "Chickpeas", two: "1 tin", four: "2 tins" },
          { item: "Olive oil", two: "1 bottle", four: "1 bottle" },
        ],
      },
    ],
  },
  {
    id: "meat-free",
    name: "Meat Free Week",
    note: "Same structure, vegetables and pulses doing the work.",
    sections: [
      {
        name: "Produce",
        items: [
          { item: "Sweet potatoes", two: "3", four: "6" },
          { item: "Courgettes", two: "2", four: "4" },
          { item: "Red peppers", two: "3", four: "5" },
          { item: "Mushrooms", two: "300 g", four: "600 g" },
        ],
      },
      {
        name: "Dairy and chilled",
        items: [
          { item: "Halloumi", two: "1 block", four: "2 blocks" },
          { item: "Eggs", two: "6", four: "12" },
        ],
      },
      {
        name: "Pantry",
        items: [
          { item: "Red lentils", two: "500 g", four: "1 kg" },
          { item: "Black beans", two: "2 tins", four: "4 tins" },
          { item: "Couscous", two: "300 g", four: "600 g" },
          { item: "Coconut milk", two: "1 tin", four: "2 tins" },
        ],
      },
    ],
  },
];

export const GROCERY_PACK_IDS = PACKS.map(p => p.id);
export function GroceryPackPreview({ initialPack }: { initialPack?: string } = {}) {
  const [packId, setPackId] = useState(initialPack && GROCERY_PACK_IDS.includes(initialPack) ? initialPack : PACKS[0]?.id ?? "easy-week");
  const [size, setSize] = useState<1 | 2 | 4 | 6>(2);
  const [checks, setChecks] = useState<Record<string, string[]>>({});
  const [storageReady, setStorageReady] = useState(false);
  const [hideTicked, setHideTicked] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const checked = checks[packId] ?? [];
  const setChecked = (next: string[] | ((current: string[]) => string[])) => setChecks(current => ({ ...current, [packId]: typeof next === "function" ? next(current[packId] ?? []) : next }));
  useEffect(() => {
    try {
      const household = Number(localStorage.getItem("skyco.grocery.household"));
      if (household === 1 || household === 2 || household === 4 || household === 6) setSize(household);
    } catch { /* Household storage is optional. */ }
    try {
      const legacy: unknown = JSON.parse(localStorage.getItem("skyco.grocery.v1") ?? "{}");
      const valid: Record<string, string[]> = {};
      for (const pack of PACKS) {
        const keys = pack.sections.flatMap(s => s.items.map(i => `${pack.id}:${i.item}`));
        const own = localStorage.getItem(`skyco.grocery.checked.${pack.id}`);
        const entries: unknown = own !== null ? JSON.parse(own) : legacy && typeof legacy === "object" && !Array.isArray(legacy) ? (legacy as Record<string, unknown>)[pack.id] : undefined;
        if (Array.isArray(entries)) valid[pack.id] = [...new Set(entries.filter((key): key is string => typeof key === "string" && keys.includes(key)))];
      }
      setChecks(valid);
    } catch { /* Storage is optional. */ }
    setStorageReady(true);
  }, []);
  useEffect(() => { if (storageReady) { try { for (const pack of PACKS) { const list = checks[pack.id] ?? []; if (list.length) localStorage.setItem(`skyco.grocery.checked.${pack.id}`, JSON.stringify(list)); else localStorage.removeItem(`skyco.grocery.checked.${pack.id}`); } localStorage.removeItem("skyco.grocery.v1"); } catch { /* Keep the list usable without storage. */ } } }, [checks, storageReady]);
  useEffect(() => { if (storageReady) { try { localStorage.setItem("skyco.grocery.household", String(size)); } catch { /* Storage is optional. */ } } }, [size, storageReady]);
  const quantity = (item: Pack["sections"][number]["items"][number]) => {
    if (size === 2) return item.two;
    if (size === 4) return item.four;
    const base = size === 1 ? item.two : item.four;
    const match = /^(\d+(?:\.\d+)?)(.*)$/.exec(base);
    if (!match) return base;
    const value = Number(match[1]) * (size === 1 ? 0.5 : 1.5);
    const unit = match[2] ?? "";
    const scaled = unit.trim() === "" || /tin|block|bottle/.test(unit) ? Math.ceil(value) : value;
    return `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(scaled)}${unit}`;
  };
  const pack = PACKS.find((p) => p.id === packId) ?? PACKS[0];
  const [printDate, setPrintDate] = useState("");
  useEffect(() => {
    let originalTitle: string | undefined;
    const before = () => { if (originalTitle === undefined) originalTitle = document.title; document.title = pack?.name ?? "Grocery list"; setPrintDate(new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date())); };
    const after = () => { if (originalTitle !== undefined) document.title = originalTitle; originalTitle = undefined; };
    setPrintDate(new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date()));
    window.addEventListener("beforeprint", before); window.addEventListener("afterprint", after);
    return () => { after(); window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, [pack?.name]);
  if (!pack) return null;
  const count = pack.sections.reduce((n, s) => n + s.items.length, 0);
  const itemKeys = pack.sections.flatMap((section) =>
    section.items.map((item) => `${pack.id}:${item.item}`),
  );
  const allChecked = checked.length === count;

  return (
    <div className="grocery-print rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <header className="hidden print:block"><h2 className="text-xl font-bold">{pack.name}</h2><p>Household: {size} people. {printDate}</p></header>
      <div className="no-print flex flex-wrap items-center gap-2" role="group" aria-label="Choose a pack">
        {PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPackId(p.id);

            }}
            aria-pressed={p.id === packId}
            className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              p.id === packId
                ? "bg-sky-deep text-primary-foreground"
                : "border border-sky-bright/30 text-sky-deep"
            }`}
          >
            {p.name}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm font-semibold text-foreground">
          Household size
          <select aria-label="Household size" value={size} onChange={event => { const value = Number(event.target.value); if (value === 1 || value === 2 || value === 4 || value === 6) setSize(value); }} className="min-h-11 rounded-lg border border-border bg-background px-3 text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            {[1, 2, 4, 6].map(value => <option key={value} value={value}>{value} {value === 1 ? "person" : "people"}</option>)}
          </select>
        </label>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {pack.note} {count} items, grouped the way the shop is laid out.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        These two packs are sample lists I wrote myself. No shop, brand or supplier is involved,
        and no prices are quoted.
      </p>

      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-sky-deep" role="status" aria-live="polite">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        {checked.length} of {count} items ticked
      </p>

      <p className="mt-2 text-xs text-muted-foreground">Checked items stay in this browser until you reset them or clear site data.</p>
      <button type="button" onClick={async () => {
        const text = `${pack.name} (sample), for ${size}\n\n` + pack.sections.map(section => `${section.name}\n` + section.items.map(i => `${checked.includes(`${pack.id}:${i.item}`) ? "[x]" : "[ ]"} ${i.item}: ${quantity(i)}`).join("\n")).join("\n\n");
        try { await navigator.clipboard.writeText(text); setCopyStatus("List copied"); } catch { setCopyStatus("Copy unavailable in this browser"); }
      }} className="no-print mt-3 min-h-11 rounded-full border border-sky-bright/30 px-4 text-xs font-semibold text-sky-deep focus-visible:ring-2 focus-visible:ring-ring">Copy list</button>
      <Button variant="outline" className="no-print ml-3" onClick={async () => { const text = `${pack.name} (sample), for ${size}\n\n` + pack.sections.map(section => `${section.name}\n` + section.items.map(i => `${checked.includes(`${pack.id}:${i.item}`) ? "[x]" : "[ ]"} ${i.item}: ${quantity(i)}`).join("\n")).join("\n\n"); try { if (navigator.share) { await navigator.share({ title: pack.name, text }); setCopyStatus("List shared"); } else { await navigator.clipboard.writeText(text); setCopyStatus("List copied"); } } catch (error) { setCopyStatus(error instanceof Error && error.name === "AbortError" ? "Sharing cancelled" : "Sharing unavailable in this browser"); } }}>Share list</Button>
      <span role="status" className="no-print ml-3 text-xs text-muted-foreground">{copyStatus}</span>
      <div className="no-print mt-3 flex flex-wrap gap-2" aria-label="Shopping list controls">
        <Button variant="outline" aria-pressed={hideTicked} onClick={() => setHideTicked(v => !v)}>Hide ticked items</Button>
        <Button variant="outline" disabled={checked.length === 0} onClick={() => { setChecked([]); setCopyStatus("All items unticked"); }}>Untick all</Button>
        <button
          type="button"
          onClick={() => setChecked(allChecked ? [] : itemKeys)}
          aria-pressed={allChecked}
          className="min-h-11 rounded-full border border-sky-bright/30 px-4 text-xs font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {allChecked ? "Clear all" : "Check all"}
        </button>
        {checked.length > 0 && !allChecked && (
          <button
            type="button"
            onClick={() => setChecked([])}
            className="min-h-11 rounded-full px-4 text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Reset checks
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {pack.sections.map((section) => (
          <div
            key={section.name}
            className="grocery-section rounded-xl border border-sky-bright/20 bg-sky-ice/30 p-4"
          >
            <h3 id={`grocery-${pack.id}-${section.name.replace(/\s+/g, "-")}`} className="text-[11px] font-bold uppercase tracking-wider text-sky-deep">
              {section.name}, {section.items.length} items
            </h3>
            <ul aria-labelledby={`grocery-${pack.id}-${section.name.replace(/\s+/g, "-")}`} className="mt-2 space-y-1.5">
              {section.items.filter(i => !hideTicked || !checked.includes(`${pack.id}:${i.item}`)).map((i) => (
                <li
                  key={i.item}
                  className="flex items-baseline justify-between gap-3 text-sm text-foreground"
                >
                  <label className="flex min-h-8 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked.includes(`${pack.id}:${i.item}`)}
                      onChange={(event) => {
                        const key = `${pack.id}:${i.item}`;
                        setChecked((current) =>
                          event.target.checked
                            ? [...current, key]
                            : current.filter((item) => item !== key),
                        );
                      }}
                      className="h-4 w-4 accent-sky-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span className={checked.includes(`${pack.id}:${i.item}`) ? "text-muted-foreground line-through" : undefined}>
                      {i.item}
                    </span>
                  </label>
                  <span className="shrink-0 font-semibold text-muted-foreground">{quantity(i)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        aria-describedby="sample-pack-note"
        className="no-print mt-5 inline-flex min-h-12 items-center gap-2 rounded-full border border-sky-bright/40 px-6 text-sm font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
        Print this list
      </button>
      <p id="sample-pack-note" className="no-print mt-2 text-xs text-muted-foreground">
        Printing includes the selected sample pack, quantities and your checked items.
      </p>
    </div>
  );
}
