import { useState } from "react";
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

export function GroceryPackPreview() {
  const [packId, setPackId] = useState(PACKS[0]?.id ?? "easy-week");
  const [size, setSize] = useState<"two" | "four">("two");
  const [checked, setChecked] = useState<string[]>([]);
  const pack = PACKS.find((p) => p.id === packId) ?? PACKS[0];
  if (!pack) return null;
  const count = pack.sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="grocery-print rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPackId(p.id);
              setChecked([]);
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
        <div className="ml-auto flex items-center gap-2">
          {(["two", "four"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={s === size}
              className={`min-h-11 rounded-full px-4 text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                s === size
                  ? "bg-sky-ice text-sky-deep"
                  : "border border-sky-bright/25 text-muted-foreground"
              }`}
            >
              {s === "two" ? "For 2" : "For 4"}
            </button>
          ))}
        </div>
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
        {checked.length} of {count} items checked
      </p>


      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {pack.sections.map((section) => (
          <div
            key={section.name}
            className="rounded-xl border border-sky-bright/20 bg-sky-ice/30 p-4"
          >
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-deep">
              {section.name}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {section.items.map((i) => (
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
                  <span className="shrink-0 font-semibold text-muted-foreground">{i[size]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="no-print mt-5 inline-flex min-h-12 items-center gap-2 rounded-full border border-sky-bright/40 px-6 text-sm font-semibold text-sky-deep transition-colors hover:bg-sky-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
        Print this list
      </button>
    </div>
  );
}
