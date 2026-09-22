import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, Callout } from "@/components/PageShell";

const UPDATED = "29 August 2026";

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
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Security and Data Handling | SkyCo" },
      { name: "twitter:description", content: "What stays on your device, what is stored, and how to report a vulnerability." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/security" }],
  }),
  component: SecurityPage,
});

const table = [
  {
    product: "CurrenSee",
    account: "Not required",
    device: "Favourite pairs and alert settings",
    server: "Nothing personal",
    external: "Market data provider for fiat and crypto rates",
  },
  {
    product: "Chronos",
    account: "Not required",
    device: "Selected date and calendar preferences",
    server: "Nothing personal",
    external: "None for the core conversion, which is calculated in the browser",
  },
  {
    product: "My Finance Friend",
    account: "Optional, guest mode available",
    device: "Guest session identifier",
    server: "Email address and the portfolio entries you add, when signed in",
    external: "Price data provider, and language processing to read your typed instruction",
  },
  {
    product: "SkyCo Grocery Packs",
    account: "Not required",
    device: "Lists and check states you build",
    server: "Nothing personal",
    external: "None",
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
      <Prose>
        <Callout title="The one line that matters">
          SkyCo never connects to a bank or brokerage account, never asks for card details, and
          never collects credentials to a financial institution. Nothing on SkyCo can move money.
        </Callout>

        <h2>What each product stores</h2>
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
          <h2>How data travels</h2>
          <ul>
            <li>Every SkyCo site is served over HTTPS, so traffic is encrypted in transit.</li>
            <li>
              Data kept on your device lives in browser storage. Clearing site data in your browser
              removes it, and SkyCo cannot read it remotely.
            </li>
            <li>
              Where a product stores account data, it sits with a managed hosting provider with
              access rules that restrict rows to the account that owns them.
            </li>
            <li>
              Third-party requests carry only what the request needs, for example a currency pair or
              a ticker symbol.
            </li>
          </ul>

          <h2>Limitations I will not hide</h2>
          <ul>
            <li>
              SkyCo is a one-person studio. There is no 24/7 on-call rota and no external security
              certification such as SOC 2 or ISO 27001. Nothing on this site claims otherwise.
            </li>
            <li>
              Products depend on third-party data providers. If a provider is down or rate limits a
              request, the product shows an error rather than a stale number presented as current.
            </li>
            <li>
              Guest data in My Finance Friend is tied to the device. Clearing browser data removes
              it and it cannot be recovered.
            </li>
          </ul>

          <h2>Reporting a vulnerability</h2>
          <p>
            If you find a security problem, email{" "}
            <a href="mailto:support@skyco.online">support@skyco.online</a> with the steps to
            reproduce it. Please do not test against other people&rsquo;s data or run disruptive
            scans. I aim to acknowledge reports within 72 hours and will credit you if you would
            like that.
          </p>

          <h2>Related</h2>
          <p>
            See the <a href="/privacy">Privacy Policy</a> for what is collected and the{" "}
            <a href="/status">Status page</a> for current product reachability.
          </p>
        </Prose>
      </div>
    </PageShell>
  );
}
