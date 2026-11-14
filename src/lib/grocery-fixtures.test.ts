import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { componentSource, declaration, evaluate, hookCallbacks } from "./fixture-source";

const file = componentSource("../components/experiences/GroceryPackPreview.tsx");
type Pack = { id: string; name: string; sections: { name: string; items: { item: string; two: string; four: string }[] }[] };
export const packs = evaluate<Pack[]>(`${declaration(file, "PACKS")} return PACKS;`);
export function groceryOutput(size: number) {
  const quantity = evaluate<(item: Pack["sections"][number]["items"][number]) => string>(`${declaration(file, "quantity")} return quantity;`, { size });
  return packs.map(pack => ({ id: pack.id, sections: pack.sections.map(section => ({ name: section.name, items: section.items.map(item => ({ item: item.item, quantity: quantity(item) })) })) }));
}
const fixture = JSON.parse(readFileSync(new URL("./__fixtures__/grocery/packs.json", import.meta.url), "utf8")) as {
  sizes: { size: number; packs: ReturnType<typeof groceryOutput> }[];
  storage: { initial: Record<string, string>; expected: Record<string, string[]> }[];
};
for (const row of fixture.sizes) {
  test(`All shipped grocery packs preserve quantities and order for household ${row.size}`, () => {
    assert.deepEqual(groceryOutput(row.size), row.packs);
    assert.deepEqual(row.packs.map(pack => pack.id), ["easy-week", "meat-free"]);
  });
}
const effects = hookCallbacks(file, "useEffect");
if (!effects[0] || !effects[1]) throw new Error("Grocery storage callbacks missing");
function storageSession(initial: Record<string, string>, unavailable = false) {
  const data = new Map(Object.entries(initial));
  let checks: Record<string, string[]> = {};
  let ready = false;
  const localStorage = {
    getItem(key: string) { if (unavailable) throw new Error("Storage blocked"); return data.get(key) ?? null; },
    setItem(key: string, value: string) { if (unavailable) throw new Error("Storage blocked"); data.set(key, value); },
    removeItem(key: string) { if (unavailable) throw new Error("Storage blocked"); data.delete(key); },
  };
  const load = () => evaluate(`return (${effects[0]})();`, { PACKS: packs, localStorage, setSize: () => {}, setChecks: (value: typeof checks) => { checks = value; }, setStorageReady: (value: boolean) => { ready = value; } });
  const save = () => evaluate(`return (${effects[1]})();`, { PACKS: packs, localStorage, checks, storageReady: ready });
  return { load, save, data, get checks() { return checks; }, get ready() { return ready; }, set checks(value) { checks = value; } };
}
for (const [index, row] of fixture.storage.entries()) {
  test(`Grocery stored-data validation ${index + 1}`, () => {
    const session = storageSession(row.initial);
    session.load();
    assert.deepEqual(session.checks, row.expected);
    assert.equal(session.ready, true);
  });
}
test("Grocery legacy v1 data migrates to isolated per-pack keys and round trips", () => {
  const session = storageSession({ "skyco.grocery.v1": JSON.stringify({ "easy-week": ["easy-week:Onions"], "meat-free": ["meat-free:Eggs"] }) });
  session.load();
  const expected = session.checks;
  session.save();
  assert.equal(session.data.has("skyco.grocery.v1"), false);
  assert.equal(session.data.get("skyco.grocery.checked.easy-week"), '["easy-week:Onions"]');
  assert.equal(session.data.get("skyco.grocery.checked.meat-free"), '["meat-free:Eggs"]');
  const restored = storageSession(Object.fromEntries(session.data));
  restored.load();
  assert.deepEqual(restored.checks, expected);
});
test("Grocery remains usable when storage reads and writes throw", () => {
  const session = storageSession({}, true);
  assert.doesNotThrow(session.load);
  assert.equal(session.ready, true);
  session.checks = { "easy-week": ["easy-week:Onions"] };
  assert.doesNotThrow(session.save);
  assert.deepEqual(session.checks, { "easy-week": ["easy-week:Onions"] });
  assert.deepEqual(groceryOutput(2), fixture.sizes.find(row => row.size === 2)?.packs);
});