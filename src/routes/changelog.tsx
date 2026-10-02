import { shareMeta, breadcrumbScript, pageScript } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { changelog, formatDate } from "@/lib/changelog";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "What's New | SkyCo" },
      {
        name: "description",
        content:
          "Releases, improvements and fixes across SkyCo. Only changes that actually shipped, with the date they went out.",
      },
      { property: "og:title", content: "What's New | SkyCo" },
      {
        property: "og:description",
        content: "Releases, improvements and fixes across SkyCo, with the date they shipped.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://skyco.online/changelog" },
      ...shareMeta("changelog", "SkyCo Changelog page share card"),
      { name: "twitter:title", content: "What's New | SkyCo" },
      { name: "twitter:description", content: "Releases, improvements and fixes across SkyCo, with the date they shipped." },
    ],
    links: [{ rel: "canonical", href: "https://skyco.online/changelog" }],
    scripts: [breadcrumbScript([{ name: "Changelog", path: "/changelog" }]), pageScript("WebPage", "SkyCo Changelog", "/changelog", "Changelog page for SkyCo, a founder-led studio of small web tools.")],
  }),
  component: ChangelogPage,
});

const tagStyle: Record<string, string> = {
  Launch: "bg-sky-deep text-white",
  Improvement: "bg-sky-ice text-sky-deep",
  Fix: "bg-muted text-muted-foreground",
};

function ChangelogPage() {
  return (
    <PageShell
      eyebrow="Changelog"
      title="What's new"
      intro="Everything listed here shipped on the date shown. This log starts with the site rebuild, so earlier product launches are not backdated into it."
    >
      <ol className="space-y-6">
        {changelog.map((entry) => (
          <li
            key={entry.date + entry.title}
            className="rounded-2xl border border-sky-bright/20 bg-card p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  tagStyle[entry.tag] ?? tagStyle["Improvement"]
                }`}
              >
                {entry.tag}
              </span>
              <time dateTime={entry.date} className="text-xs font-semibold text-muted-foreground">
                {formatDate(entry.date)}
              </time>
            </div>
            <h2 className="mt-3 text-lg font-bold text-foreground">{entry.title}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-muted-foreground">
        Want something added to a product?{" "}
        <Link to="/support" className="font-semibold text-sky-deep underline underline-offset-2">
          Tell me what would help
        </Link>
        .
      </p>
    </PageShell>
  );
}
