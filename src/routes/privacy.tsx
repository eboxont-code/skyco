import { shareMeta, breadcrumbScript, pageScript } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, Callout } from "@/components/PageShell";

const UPDATED = "6 November 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy for SkyCo web tools" },
      {
        name: "description",
        content:
          "What SkyCo stores, what it does not, and how each product handles your data. Written in plain English.",
      },
      { property: "og:title", content: "Privacy policy for SkyCo web tools" },
      {
        property: "og:description",
        content: "What SkyCo stores, what it does not, and how each product handles your data.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/privacy" },
      ...shareMeta("privacy", "SkyCo Privacy page share card"),
      { name: "twitter:title", content: "Privacy policy for SkyCo web tools" },
      { name: "twitter:description", content: "What SkyCo stores, what it does not, and how each product handles your data." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/privacy" }],
    scripts: [breadcrumbScript([{ name: "Privacy", path: "/privacy" }]), pageScript("WebPage", "SkyCo Privacy", "/privacy", "Privacy page for SkyCo, a founder-led studio of small web tools.")],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Trust"
      title="Privacy Policy"
      intro="SkyCo is a small studio. The short version: I collect as little as possible, and no SkyCo product sells or shares your data with advertisers."
      updated={UPDATED}
    >
      <nav aria-label="On this page" className="mb-8"><p className="font-semibold text-foreground">On this page</p><ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2"><li><a href="#who-this-covers" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Who this covers</a></li><li><a href="#what-i-collect" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">What I collect</a></li><li><a href="#what-i-do-not-do" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">What I do not do</a></li><li><a href="#third-party-services" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Third-party services</a></li><li><a href="#cookies" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Cookies</a></li><li><a href="#retention-and-deletion" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Retention and deletion</a></li><li><a href="#children" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Children</a></li><li><a href="#changes" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Changes</a></li><li><a href="#contact" className="inline-flex min-h-11 items-center text-sky-deep underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Contact</a></li></ul></nav>
      <Prose>
        <Callout title="The short version">
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Most SkyCo products work without an account.</li>
            <li>I do not sell personal data, and there are no advertising trackers.</li>
            <li>Financial figures you enter are yours; SkyCo has no access to your bank or broker.</li>
            <li>Email me at support@skyco.online to ask what is stored or to have it deleted.</li>
          </ul>
        </Callout>

        <h2 id="who-this-covers" className="scroll-mt-24">Who this covers</h2>
        <p>
          This policy applies to skyco.online and all five shipped SkyCo products: CurrenSee,
          Chronos, My Finance Friend, SkyCo Grocery Packs and Float.
        </p>

        <h2 id="what-i-collect" className="scroll-mt-24">What I collect</h2>
        <h3>On this website</h3>
        <p>
          The product tools do not require an account. The Support page keeps the message draft in
          this browser tab's session storage while you write. Submitting the form opens a pre-filled
          email in your own mail app; SkyCo does not receive the message unless you press Send in
          that app. The draft is removed from session storage when the email app is opened.
        </p>
        <p>
          Standard web server logs (IP address, browser type, requested page, timestamp) are created
          by the hosting provider so the site can be served and abuse can be spotted.
        </p>

        <h3>In CurrenSee</h3>
        <p>
          CurrenSee uses this browser's local storage for the last currency pair and amount, recent
          pairs, favourites, the default pair, saved conversion snapshots (up to 20), rate alerts
          (up to 10), the alert check interval and alert history (up to 30). These values stay in
          this browser unless you copy a link: a CurrenSee link includes the selected pair and
          entered amount in its URL. The amount is multiplied in your browser; the rate request to
          SkyCo's server contains the selected currency codes.
        </p>

        <h3>In Chronos</h3>
        <p>
          The selected date and date-of-birth input remain in page memory while you use the tool.
          The calendar conversion runs in your browser. When you choose to share a date, the link
          includes that selected date in its URL.
        </p>

        <h3>In My Finance Friend</h3>
        <p>
          The typed trade sentence and up to five recent parsed entries stay in page memory while
          the page is open. They are not sent to a server or saved in persistent browser storage.
          You can choose to copy a CSV to your clipboard.
        </p>
        <p>
          <strong>SkyCo never connects to your bank or brokerage.</strong> There is no account
          linking, no read access to your real holdings, and no payment details are collected
          anywhere on SkyCo.
        </p>

        <h3>In SkyCo Grocery Packs</h3>
        <p>
          Checked items are stored per pack in this browser's local storage. The selected household
          size is also stored there. These settings remain until you reset them or clear site data.
          If you choose Copy or Share, the list is handed to your clipboard or your device's share
          sheet.
        </p>

        <h3>In Float</h3>
        <p>
          Float starts with sample figures. Your edits stay in page memory unless you explicitly
          choose Keep my numbers as a guest. Guest mode stores income, bill and BNPL entries in this
          browser's local storage, including names, amounts, dates, recurrence and optional deal
          details. Clear my numbers removes the saved guest record. This browser storage is not
          application-level encrypted.
        </p>
        <p>
          Share these numbers creates a URL containing the entries as Base64 URL-safe encoded data.
          Base64 is not encryption. The link can include names, amounts, dates, recurrence, original
          amounts and deal end dates. Anyone with the link can decode and read those details. The
          URL may also appear in browser history and may be processed in hosting request logs when
          opened. Do not share figures you would not want a link recipient to see.
        </p>

        <h3>Float waitlist</h3>
        <p>
          If you submit the Float waitlist form, the selected product, email address and optional
          name are sent to a server function and inserted into the connected Supabase
          <code>waitlist_submissions</code> table. This is server-side storage, separate from your
          Float planner entries. The application schema records the submission time; the repository
          does not define an automatic deletion period.
        </p>

        <h2 id="what-i-do-not-do" className="scroll-mt-24">What I do not do</h2>
        <ul>
          <li>No selling or renting of personal data.</li>
          <li>No advertising networks and no behavioural ad tracking.</li>
          <li>No collecting of bank credentials, card numbers or government identifiers.</li>
        </ul>

        <h2 id="third-party-services" className="scroll-mt-24">Third-party services</h2>
        <p>Outside services currently used by the shipped experiences:</p>
        <ul>
          <li>
            <strong>Frankfurter</strong> provides fiat reference-rate data for CurrenSee;
            <strong> CoinGecko</strong> provides BTC, ETH and SOL prices; and
            <strong> Nepal Rastra Bank</strong> provides supported NPR-related reference rates.
            Rate lookups are made by SkyCo's server using the requested currency codes. The amount
            you convert is multiplied in your browser and is not part of that rate request.
          </li>
          <li>
            <strong>Supabase</strong> stores the product, optional name and email address when you
            submit the Float waitlist form. The app does not send Float planner entries to Supabase.
          </li>
          <li>
            <strong>Hosting infrastructure</strong> serves the website and may process technical
            request details such as IP address, user agent, requested URL and timestamp. The active
            production host and its exact log-retention settings are not identified in this
            repository, so those details have not been independently verified here.
          </li>
          <li>
            Support email is opened in your own mail app. Your email provider handles the message
            only after you choose to send it.
          </li>
        </ul>

        <h2 id="cookies" className="scroll-mt-24">Cookies</h2>
        <p>
          The product tools do not require a sign-in session. The features described above use
          browser local storage or session storage in a few places; that storage is separate from
          cookies and remains on this browser unless a value is included in a link or you choose to
          share it.
        </p>

        <h2 id="retention-and-deletion" className="scroll-mt-24">Retention and deletion</h2>
        <p>
          CurrenSee preferences and saved records, Grocery settings and Float guest records remain
          in browser local storage until you remove them using the product controls or clear this
          site's browser data. My Finance Friend's recent entries are held only in page memory and
          reset when you leave or refresh. The Support message draft is kept in session storage for
          the tab's session and is removed when the email app is opened.
        </p>
        <p>
          Float waitlist submissions are stored in Supabase. The application code does not specify
          an automatic expiry or retention period for those rows. Hosting and database backup
          retention are controlled by the relevant provider settings, which have not been verified
          in this repository.
        </p>

        <h2 id="children" className="scroll-mt-24">Children</h2>
        <p>SkyCo products are not directed at children under 13 and I do not knowingly collect their data.</p>

        <h2 id="changes" className="scroll-mt-24">Changes</h2>
        <p>
          If this policy changes in a way that affects you, the updated date at the top of this page
          changes and the change is listed on the <a href="/changelog">What&rsquo;s new</a> page.
        </p>

        <h2 id="contact" className="scroll-mt-24">Contact</h2>
        <p>
          Privacy questions, access requests and deletion requests all go to{" "}
          <a href="mailto:support@skyco.online">support@skyco.online</a>.
        </p>
      </Prose>
    </PageShell>
  );
}
