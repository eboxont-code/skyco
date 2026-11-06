import { shareMeta, breadcrumbScript, pageScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, Callout } from "@/components/PageShell";

const UPDATED = "6 November 2026";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security and Data Handling | SkyCo" },
      {
        name: "description",
        content:
          "How SkyCo handles data: what stays on your device, what is stored, how third-party APIs are used, and how to report a vulnerability.",
      },
      { property: "og:title", content: "Security and Data Handling | SkyCo" },
      {
        property: "og:description",
        content: "What stays on your device, what is stored, and how to report a vulnerability.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/security" },
      ...shareMeta("security", "SkyCo Security page share card"),
      { name: "twitter:title", content: "Security and Data Handling | SkyCo" },
      { name: "twitter:description", content: "What stays on your device, what is stored, and how to report a vulnerability." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/security" }],
    scripts: [breadcrumbScript([{ name: "Security", path: "/security" }]), pageScript("WebPage", "SkyCo Security", "/security", "Security page for SkyCo, a founder-led studio of small web tools.")],
  }),
  component: SecurityPage,
});

const table = [
  {
    product: "CurrenSee",
    account: "Not required",
    device: "Browser storage keeps the last pair and amount, recent pairs, favourites, default pair, up to 20 saved conversions, up to 10 alerts, the check interval and up to 30 alert-history entries.",
    server: "The rate function receives currency codes, not the conversion amount. Public rate responses are cached in server memory for 60 seconds.",
    external: "Frankfurter for fiat reference rates, CoinGecko for BTC/ETH/SOL, and Nepal Rastra Bank for supported NPR-related rates.",
  },
  {
    product: "Chronos",
    account: "Not required",
    device: "Selected date and date-of-birth input stay in page memory. A shared date link includes the selected date in its URL.",
    server: "Calendar readings are calculated in the browser; entered dates are not sent to a calculation service.",
    external: "No external calendar provider for the core calculation; browser calendar support and bundled code are used.",
  },
  {
    product: "My Finance Friend",
    account: "Not required",
    device: "Typed trade text and up to five recent parsed entries stay in page memory while the page is open. CSV is copied only when requested.",
    server: "The parser input and session entries are not sent to a server.",
    external: "None for the in-page parser.",
  },
  {
    product: "SkyCo Grocery Packs",
    account: "Not required",
    device: "Checked items are saved per pack in local storage; selected household size is also saved in local storage.",
    server: "No grocery-list data is submitted to a SkyCo server by the list experience.",
    external: "None for the in-page list.",
  },
  {
    product: "Float",
    account: "Not required",
    device: "Income, bill and BNPL entries are saved in local storage only after the visitor chooses guest mode. Browser storage is not application-level encrypted.",
    server: "Planner calculations run locally. The waitlist form sends product, email and optional name to a server function that inserts a Supabase row. Share URLs contain encoded planner entries in the query string and may be present in request logs.",
    external: "Supabase for Float waitlist submissions only; Float planner entries are not sent to Supabase.",
  },
];

function SecurityPage() {
  return (
    <PageShell
      eyebrow="Trust"
      title="Security and data handling"
      intro="A straight answer to the question that matters for a finance or utility tool: where does my data actually go?"
      updated={UPDATED}
      wide
    >
      <nav aria-label="On this page" className="mb-8"><p className="font-semibold text-foreground">On this page</p><ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2"><li><a href="#what-each-product-stores" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">What each product stores</a></li><li><a href="#how-each-tool-works-with-your-data" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">How each tool works with your data</a></li><li><a href="#how-data-travels" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">How data travels</a></li><li><a href="#limitations-i-will-not-hide" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Limitations I will not hide</a></li><li><a href="#reporting-a-vulnerability" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Reporting a vulnerability</a></li><li><a href="#related" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Related</a></li></ul></nav>
      <Prose>
        <Callout title="The one line that matters">
          SkyCo never connects to a bank or brokerage account, never asks for card details, and
          never collects credentials to a financial institution. Nothing on SkyCo can move money.
        </Callout>

        <h2 id="what-each-product-stores" className="scroll-mt-24">What each product stores</h2>
      </Prose>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-sky-bright/20">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">Data handling per SkyCo product</caption>
          <thead className="bg-sky-ice/60 text-xs font-bold uppercase tracking-wider text-sky-deep">
            <tr>
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">Account</th>
              <th scope="col" className="px-4 py-3">Stays on your device</th>
              <th scope="col" className="px-4 py-3">Stored by SkyCo</th>
              <th scope="col" className="px-4 py-3">Third-party calls</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {table.map((row) => (
              <tr key={row.product} className="border-t border-sky-bright/15 align-top">
                <th scope="row" className="px-4 py-3 font-semibold text-foreground">
                  {row.product}
                </th>
                <td className="px-4 py-3">{row.account}</td>
                <td className="px-4 py-3">{row.device}</td>
                <td className="px-4 py-3">{row.server}</td>
                <td className="px-4 py-3">{row.external}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <Prose>
          <h2 id="how-each-tool-works-with-your-data" className="scroll-mt-24">How each tool works with your data</h2>
          <ul>
            <li>CurrenSee: the entered amount is multiplied in your browser. Only the selected pair codes are sent to the server rate function. Last pair/amount, recent pairs, favourites, default pair, saved conversions, alerts and alert history can remain in browser local storage.</li>
            <li>Chronos: date conversion and date-of-birth calculations run in the browser. Sharing a date creates a URL that includes the selected date.</li>
            <li>My Finance Friend: the parser runs locally. The typed sentence and up to five recent entries remain in page memory only until you leave or refresh; copying CSV is an explicit action.</li>
            <li>Grocery Packs: checked items and household size are stored in browser local storage. Copy and Share actions hand the list to your clipboard or device share sheet.</li>
            <li>Float: planner data stays in page memory until you choose guest mode, which saves it to browser local storage. The share URL contains Base64 URL-safe encoded entries; Base64 is not encryption and anyone with the link can read the figures.</li>
            <li>Support: the message draft is kept in session storage for the current tab. The form opens a pre-filled email; the message reaches SkyCo only after you send it from your mail app.</li>
            <li>Float waitlist: submitting the form sends the selected product, email and optional name to a server function that inserts a row into Supabase.</li>
          </ul>

          <h2 id="how-data-travels" className="scroll-mt-24">How data travels</h2>
          <ul>
            <li>Site traffic is served over HTTPS, which encrypts traffic in transit between the browser and the site.</li>
            <li>Browser local storage and session storage are not application-level encryption. Anyone with access to the same browser profile or device may be able to access locally stored values.</li>
            <li>A Float share URL exposes its encoded income, bill and BNPL entries to anyone who receives the link. The query string may also appear in browser history and may be processed by hosting request logs when opened.</li>
            <li>Hosting infrastructure may process technical request details such as IP address, user agent, URL and timestamp. The active production host and its exact log-retention settings are not established by this repository review.</li>
            <li>Supabase receives only the selected product, email and optional name when a visitor submits the Float waitlist form. The planner's guest records are not uploaded to it.</li>
            <li>CurrenSee's server-side rate requests go to Frankfurter, CoinGecko or Nepal Rastra Bank as appropriate. The amount being converted is not included in the rate request.</li>
          </ul>

          <h2 id="limitations-i-will-not-hide" className="scroll-mt-24">Limitations I will not hide</h2>
          <ul>
            <li>
              SkyCo is a one-person studio. There is no 24/7 on-call rota and no external security
              certification such as SOC 2 or ISO 27001. Nothing on this site claims otherwise.
            </li>
            <li>
              Products depend on third-party data providers. If a provider is unavailable, CurrenSee
              may show a cached rate with an explicit stale label or show the rate as unavailable;
              it does not label an old value as newly current.
            </li>
            <li>My Finance Friend's unsaved entries reset when the page is left or refreshed. CurrenSee and Grocery preferences can persist in browser storage, and Float persists planner entries only after guest mode is enabled.</li>
            <li>The repository does not define an automatic retention period for Float waitlist rows. The exact production hosting, request-log and database-backup retention settings have not been verified here.</li>
          </ul>

          <h2 id="reporting-a-vulnerability" className="scroll-mt-24">Reporting a vulnerability</h2>
          <p>
            If you find a security problem, email{" "}
            <a href="mailto:support@skyco.online">support@skyco.online</a> with the steps to
            reproduce it. Please do not test against other people&rsquo;s data or run disruptive
            scans. I aim to acknowledge reports within 72 hours and will credit you if you would
            like that.
          </p>

          <h2 id="report-a-problem" className="scroll-mt-24">Report a problem</h2>
          <p>
            Use the <a href="/support?product=security">Support page</a> for security reports. It helps
            to include the page address, what you did, what you expected, what happened instead, and
            your browser and device. Screenshots are welcome. Leave out passwords and private data.
          </p>

          <h2 id="related" className="scroll-mt-24">Related</h2>
          <p>
            See the <a href="/privacy">Privacy Policy</a> for what is collected and the{" "}
            <a href="/status">Status page</a> for current product reachability.
          </p>
        </Prose>
      </div>
    </PageShell>
  );
}
