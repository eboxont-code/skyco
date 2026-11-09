import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { liveProjects } from "./projects";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8").replace(/\s+/g, " ");

const privacy = read("../routes/privacy.tsx");
const security = read("../routes/security.tsx");
const floatShare = read("./float-share.ts");
const floatGuest = read("./float-guest.ts");
const waitlistSchema = read("./waitlist-schema.ts");
const waitlistFunction = read("./waitlist.functions.ts");
const contactForm = read("../components/ContactForm.tsx");
const currenSeeStore = read("./currensee-store.ts");
const groceryPreview = read("../components/experiences/GroceryPackPreview.tsx");

test("privacy coverage follows all five shipped registry products", () => {
  const coverage =
    privacy.match(/<h2 id="who-this-covers"[\s\S]*?<h2 id="what-i-collect"/)?.[0] ?? "";

  assert.equal(liveProjects.length, 5);
  for (const project of liveProjects) {
    assert.ok(
      coverage.includes(project.name),
      "Missing " + project.name + " from privacy coverage",
    );
  }
});

test("security table has one ordered row per live product", () => {
  const table = security.match(/const table = \[([\s\S]*?) \];/)?.[1] ?? "";
  const rowNames = Array.from(table.matchAll(/product:\s*"([^"]+)"/g), (match) => match[1]);

  assert.deepEqual(
    rowNames,
    liveProjects.map((project) => project.name),
  );
  assert.match(security, /<td className="px-4 py-3">\{row\.external\}<\/td>/);
});

test("CurrenSee and Grocery persistence disclosures match browser storage", () => {
  assert.match(currenSeeStore, /localStorage/);
  assert.match(groceryPreview, /localStorage/);
  assert.match(privacy, /CurrenSee uses this browser's local storage/);
  assert.match(privacy, /Checked items are stored per pack in this browser's local storage/);
  assert.match(privacy, /selected household\s+size is also stored there/);
});

test("Float guest disclosure matches local storage and encryption limitations", () => {
  assert.match(floatGuest, /window\.localStorage\.setItem\(KEY,\s*JSON\.stringify\(data\)\)/);
  assert.match(privacy, /explicitly\s+choose Keep my numbers as a guest/);
  assert.match(privacy, /not\s+application-level encrypted/);
  assert.match(security, /not application-level encrypted/);
});

test("Float share disclosure covers every serialized field and Base64 limitation", () => {
  const tuple =
    floatShare.match(/function toTuple\(e: ShareEntry\): Tuple \{([\s\S]*?) \}/)?.[1] ?? "";

  for (const field of ["name", "amount", "date", "frequency", "originalAmount", "dealEndsOn"]) {
    assert.ok(tuple.includes("e." + field), "Missing serialized share field: " + field);
  }

  assert.match(privacy, /Base64 is not encryption/);
  assert.match(
    privacy,
    /names, amounts,\s+dates, recurrence, original\s+amounts and deal end dates/,
  );
  assert.match(security, /Base64 is not encryption/);
});

test("Float waitlist disclosure matches validated fields and Cloud storage", () => {
  for (const field of ["product", "name", "email"]) {
    assert.ok(waitlistSchema.includes(field + ": z.string()"), "Missing waitlist field: " + field);
  }

  assert.match(waitlistFunction, /from\("waitlist_submissions"\)\.insert\(data\)/);
  assert.match(
    privacy,
    /selected product, email address and optional\s+name are sent to a server function/,
  );
  assert.match(privacy, /does\s+not define an automatic deletion period/);
  assert.match(
    security,
    /Lovable Cloud receives only the selected product, email and optional name/,
  );
});

test("Support disclosure matches session storage and mailto handoff", () => {
  assert.match(contactForm, /sessionStorage\.setItem\("skyco\.contact\.draft"/);
  assert.match(contactForm, /sessionStorage\.removeItem\("skyco\.contact\.draft"\)/);
  assert.match(contactForm, /navigator\.userAgent/);
  assert.ok(contactForm.includes("window.location.href = " + String.fromCharCode(96) + "mailto:"));
  assert.match(privacy, /session storage/);
  assert.match(privacy, /browser user-agent string/);
  assert.match(privacy, /does not receive the message unless you\s+press\s+Send in that app/);
});

test("Chronos and Finance Friend URL and page-memory boundaries stay documented", () => {
  assert.match(privacy, /selected date is reflected in the page URL/);
  assert.match(privacy, /comparison date and date-of-birth inputs remain in page memory/);
  assert.match(
    privacy,
    /typed trade sentence and up to five recent\s+parsed entries stay in page memory/,
  );
});

test("third-party providers and unverified hosting retention remain disclosed", () => {
  for (const provider of ["Frankfurter", "CoinGecko", "Nepal Rastra Bank", "Lovable Cloud"]) {
    assert.ok(privacy.includes(provider), "Missing provider disclosure: " + provider);
  }

  assert.match(privacy, /active host and its exact log-retention settings\s+are not established/);
  assert.match(
    security,
    /active production host and its exact log-retention settings are not established/,
  );
});

test("privacy and security copy avoids unsupported blanket claims", () => {
  assert.doesNotMatch(privacy, /Nothing you type\./);
  assert.doesNotMatch(
    privacy,
    /current in-page product experiences do not retain what you enter after you leave/,
  );
  assert.match(security, /There is no 24\/7 on-call rota/);
});
