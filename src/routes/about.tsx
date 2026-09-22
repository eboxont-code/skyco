import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Prose, Callout } from "@/components/PageShell";
import { fallbackDirectory, splitDirectory, entryHref, type ResolvedProject } from "@/lib/projects";
import { getProjectDirectory } from "@/lib/projects.functions";

export const Route = createFileRoute("/about")({
  loader: async (): Promise<ResolvedProject[]> => {
    try {
      return await getProjectDirectory();
    } catch {
      return fallbackDirectory;
    }
  },
  head: () => ({
    meta: [
      { title: "About SkyCo | A studio for small, useful web tools" },
      {
        name: "description",
        content:
          "SkyCo is a founder-led software studio. How the products are built, what one job per product means, and why you can trust the numbers.",
      },
      { property: "og:title", content: "About SkyCo" },
      {
        property: "og:description",
        content: "A founder-led studio building small web tools that each do one job well.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/about" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "About SkyCo | A studio for small, useful web tools" },
      { name: "twitter:description", content: "A founder-led studio building small web tools that each do one job well." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const live = splitDirectory(Route.useLoaderData()).live;

  return (
    <PageShell
      eyebrow="About"
      title="A studio for small, useful tools"
      intro="SkyCo is a software company run by one person. Every product here started as a chore I kept repeating until building the tool was faster than doing it again."
    >
      <Prose>
        <h2>One job per product</h2>
        <p>
          Most software grows until it needs a tutorial. I go the other way. A SkyCo product opens,
          answers the question, and gets out of the way. If a feature does not serve that one job it
          does not ship.
        </p>

        <h2>How I build</h2>
        <ul>
          <li>
            <strong>Browser first.</strong> Nothing to install, works on a phone, shareable as a
            link.
          </li>
          <li>
            <strong>No account unless it earns one.</strong> Sign-in exists only where data has to
            follow you between devices.
          </li>
          <li>
            <strong>Fast over flashy.</strong> Pages are kept light so the first useful screen
            arrives quickly.
          </li>
          <li>
            <strong>Honest states.</strong> When a data provider fails, the product says so instead
            of showing a confident wrong number.
          </li>
        </ul>

        <h2>What I will not do</h2>
        <Callout title="Commitments">
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>No selling your data, and no advertising trackers.</li>
            <li>No connecting to your bank or brokerage, and no card details anywhere.</li>
            <li>No invented reviews, user counts or certifications on this site.</li>
            <li>No dark patterns to keep you in a product longer than the job needs.</li>
          </ul>
        </Callout>

        <h2>The products</h2>
      </Prose>

      <ul className="mt-5 space-y-3">
        {live.map((p) => (
          <li key={p.slug} className="rounded-2xl border border-sky-bright/20 bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-bold text-foreground">{p.name}</h3>
              <a
                href={entryHref(p)}
                className="text-xs font-bold text-sky-deep underline underline-offset-2"
              >
                Use {p.name}
              </a>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {p.why ?? p.description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Prose>
          <h2>Where SkyCo is going</h2>
          <p>
            The plan is not ten more products. It is making the existing ones feel finished: clean
            SkyCo addresses for each, clearer first screens, and visible reliability. Progress is
            posted on <Link to="/changelog">What&rsquo;s new</Link>.
          </p>

          <h2>Talk to me</h2>
          <p>
            Ideas, bugs and blunt feedback all go to the same inbox on the{" "}
            <Link to="/support">Support page</Link>.
          </p>
        </Prose>
      </div>
    </PageShell>
  );
}
