import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import badge512 from "../assets/skyco-badge-512.webp";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { liveProjects } from "../lib/projects";

function NotFoundComponent() {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <img src={badge512} alt="" width={96} height={96} className="mx-auto h-24 w-24" />
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-sky-deep">Error 404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          That address does not match a page on SkyCo. These links all work:
        </p>
        <nav aria-label="Helpful links" className="mt-6">
          <ul className="grid gap-2 text-sm font-semibold">
            <li><Link to="/" className="inline-flex min-h-11 items-center justify-center rounded-full bg-sky-deep px-6 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Back to the SkyCo hub</Link></li>
            <li><Link to="/currensee" className="text-sky-deep underline underline-offset-4">CurrenSee</Link></li>
            <li><Link to="/chronos" className="text-sky-deep underline underline-offset-4">Chronos</Link></li>
            <li><Link to="/finance-friend" className="text-sky-deep underline underline-offset-4">My Finance Friend</Link></li>
            <li><Link to="/grocery" className="text-sky-deep underline underline-offset-4">SkyCo Grocery Packs</Link></li>
          </ul>
        </nav>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: ({ matches }) => {
    const notFound = matches.some(
      (m) => m.status === "notFound" || (m as { globalNotFound?: boolean }).globalNotFound,
    );
    const nfMeta = [
      { title: "Page not found | SkyCo" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "This SkyCo page does not exist. Use the links to get back to the hub or one of the four tools." },
      { property: "og:title", content: "Page not found | SkyCo" },
      { property: "og:description", content: "This SkyCo page does not exist. Use the links to get back to the hub or one of the four tools." },
      { name: "twitter:title", content: "Page not found | SkyCo" },
      { name: "twitter:description", content: "This SkyCo page does not exist. Use the links to get back to the hub or one of the four tools." },
      { property: "og:image", content: "https://skyco.online/og/not-found.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SkyCo page not found" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://skyco.online/og/not-found.jpg" },
      { name: "twitter:image:alt", content: "SkyCo page not found" },
    ];
    const keyOf = (m: Record<string, unknown>) => ("title" in m ? "title" : String(m.name ?? m.property ?? ""));
    const nfKeys = new Set(nfMeta.map(keyOf));
    const pick = <T extends Record<string, unknown>>(base: T[]) =>
      notFound ? [...base.filter((m) => !nfKeys.has(keyOf(m))), ...nfMeta] : base;
    return {
    meta: pick([
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SkyCo | Small web tools for everyday life" },
      { name: "description", content: `SkyCo is a founder-led studio building focused web tools: ${liveProjects.map((p) => p.name).join(", ")}. Free to open, no account required.`.slice(0, 158) },
      { name: "author", content: "SkyCo" },
      { property: "og:site_name", content: "SkyCo" },
      { property: "og:image", content: "https://skyco.online/og/home.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "SkyCo small web tools for everyday life" },
      { name: "twitter:image", content: "https://skyco.online/og/home.jpg" },
      { name: "twitter:image:alt", content: "SkyCo small web tools for everyday life" },
      { property: "og:title", content: "SkyCo | Small web tools for everyday life" },
      { property: "og:description", content: `A founder-led studio building focused web tools: ${liveProjects.map((p) => p.name).join(", ")}. All free to open.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SkyCo | Small web tools for everyday life" },
      { name: "twitter:description", content: `A founder-led studio building focused web tools: ${liveProjects.map((p) => p.name).join(", ")}. All free to open.` },
    ]),
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      {
        rel: "preload",
        as: "image",
        href: badge512,
        fetchPriority: "high",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "SkyCo",
          url: "https://skyco.online",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SkyCo",
          slogan: "As Above, So Below",
          description:
            "SkyCo is a founder-led software studio building focused web tools for everyday tasks.",
          url: "https://skyco.online",
          logo: "https://skyco.online/__l5e/assets-v1/4a615c4c-3ced-40e4-a437-0b7ba2d19474/skyco-badge.png",
          subOrganization: liveProjects.map((p) => ({
            "@type": "Organization",
            name: p.name,
            url: `https://skyco.online${p.path ?? ""}`,
            description: p.tagline,
          })),
        }),
      },
    ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main-content"
          className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
