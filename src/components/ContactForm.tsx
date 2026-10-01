import { useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/site-nav";

const topics = ["Bug report", "Feature idea", "Privacy or security question", "Something else"];
const products = ["CurrenSee", "Chronos", "My Finance Friend", "Grocery Packs", "The SkyCo site"];

const field =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Builds an email in the visitor's own mail app. Nothing is sent to or stored by SkyCo from this form. */
export function ContactForm() {
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const message = String(d.get("message") ?? "").trim();
    if (message.length < 10) {
      setError("Please write a few words so I know what happened.");
      return;
    }
    setError("");
    const subject = `${d.get("topic")}: ${d.get("product")}`;
    const name = String(d.get("name") ?? "").trim();
    const body = `${message}\n\n${name ? `From: ${name}\n` : ""}Browser: ${navigator.userAgent}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section aria-labelledby="contact-heading" className="mt-12 rounded-2xl border border-sky-bright/25 bg-sky-ice/40 p-6">
      <h2 id="contact-heading" className="text-2xl font-extrabold tracking-tight text-foreground">
        Write to me
      </h2>
      <p id="contact-note" className="mt-2 text-sm text-muted-foreground">
        This form opens a ready-made email in your own mail app. Nothing is sent or stored until you
        press send there.
      </p>
      <form onSubmit={onSubmit} aria-describedby="contact-note" noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-foreground">
          Topic
          <select name="topic" className={field}>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-foreground">
          Product
          <select name="product" className={field}>
            {products.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-foreground sm:col-span-2">
          Your name (optional)
          <input name="name" autoComplete="name" className={field} />
        </label>
        <label className="text-sm font-semibold text-foreground sm:col-span-2">
          Message
          <textarea
            name="message"
            rows={5}
            required
            aria-invalid={error ? true : undefined}
            aria-describedby="contact-error"
            className={field}
          />
        </label>
        <p id="contact-error" role="alert" className="text-sm font-medium text-destructive sm:col-span-2">
          {error}
        </p>
        <button
          type="submit"
          className="inline-flex min-h-12 w-fit items-center rounded-full bg-sky-deep px-7 text-sm font-bold text-primary-foreground hover:bg-sky-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Open my email app
        </button>
      </form>
    </section>
  );
}
