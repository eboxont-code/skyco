import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Prose, Callout } from "@/components/PageShell";

const UPDATED = "29 August 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | SkyCo" },
      {
        name: "description",
        content:
          "What SkyCo stores, what it does not, and how each product handles your data. Written in plain English.",
      },
      { property: "og:title", content: "Privacy Policy | SkyCo" },
      {
        property: "og:description",
        content: "What SkyCo stores, what it does not, and how each product handles your data.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/privacy" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy | SkyCo" },
      { name: "twitter:description", content: "What SkyCo stores, what it does not, and how each product handles your data." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/privacy" }],
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
      <Prose>
        <Callout title="The short version">
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Most SkyCo products work without an account.</li>
            <li>I do not sell personal data, and there are no advertising trackers.</li>
            <li>Financial figures you enter are yours; SkyCo has no access to your bank or broker.</li>
            <li>Email me at support@skyco.online to ask what is stored or to have it deleted.</li>
          </ul>
        </Callout>

        <h2>Who this covers</h2>
        <p>
          This policy applies to skyco.online and the SkyCo products linked from it: CurrenSee,
          Chronos, My Finance Friend and SkyCo Grocery Packs.
        </p>

        <h2>What I collect</h2>
        <h3>On this website</h3>
        <p>
          Nothing you type. There is no signup and no contact form that posts to a server. The
          support page opens your own email client, so the message travels through your email
          provider, not through SkyCo.
        </p>
        <p>
          Standard web server logs (IP address, browser type, requested page, timestamp) are created
          by the hosting provider so the site can be served and abuse can be spotted.
        </p>

        <h3>In products without accounts</h3>
        <p>
          CurrenSee, Chronos and SkyCo Grocery Packs do not ask you to sign in. Preferences such as
          a saved currency pair or a favourite are stored in your own browser, on your own device,
          and are removed when you clear your browser storage.
        </p>

        <h3>In My Finance Friend</h3>
        <p>
          This product offers a guest mode and an optional account. In guest mode your data sits in
          a temporary account tied to that device. If you create an account, your email address and
          the portfolio entries you add are stored so the same data is there next time you sign in.
        </p>
        <p>
          <strong>SkyCo never connects to your bank or brokerage.</strong> There is no account
          linking, no read access to your real holdings, and no payment details are collected
          anywhere on SkyCo.
        </p>

        <h2>What I do not do</h2>
        <ul>
          <li>No selling or renting of personal data.</li>
          <li>No advertising networks and no behavioural ad tracking.</li>
          <li>No collecting of bank credentials, card numbers or government identifiers.</li>
        </ul>

        <h2>Third-party services</h2>
        <p>Products call outside services to do their job. In broad terms:</p>
        <ul>
          <li>
            <strong>Market data providers</strong> supply exchange rates, crypto prices and share
            prices to CurrenSee and My Finance Friend. Requests carry the data needed to answer
            them, such as a currency pair or a ticker.
          </li>
          <li>
            <strong>Hosting and infrastructure providers</strong> serve the sites and store account
            data for products that have accounts.
          </li>
          <li>
            <strong>Language processing</strong> is used in My Finance Friend to read a typed
            instruction such as a trade description. Only the text you send is processed.
          </li>
        </ul>
        <p>
          If you want the exact provider list for a specific product, email me and I will tell you
          what that product currently uses.
        </p>

        <h2>Cookies</h2>
        <p>
          This website does not set advertising or analytics cookies. Products that offer accounts
          use a session cookie or local storage entry so you stay signed in. That is functional, not
          tracking.
        </p>

        <h2>Retention and deletion</h2>
        <p>
          Data stored in your browser stays until you clear it. Account data in My Finance Friend
          stays until you delete it in the product or ask me to remove it. Requests to
          support@skyco.online are actioned within 30 days.
        </p>

        <h2>Children</h2>
        <p>SkyCo products are not directed at children under 13 and I do not knowingly collect their data.</p>

        <h2>Changes</h2>
        <p>
          If this policy changes in a way that affects you, the updated date at the top of this page
          changes and the change is listed on the <a href="/changelog">What&rsquo;s new</a> page.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy questions, access requests and deletion requests all go to{" "}
          <a href="mailto:support@skyco.online">support@skyco.online</a>.
        </p>
      </Prose>
    </PageShell>
  );
}
