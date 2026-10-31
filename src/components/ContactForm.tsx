import { useEffect, useRef, useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/site-nav";

const topics = ["General", "CurrenSee", "Chronos", "Finance Friend", "Grocery", "Float", "Security"];
const products = ["CurrenSee", "Chronos", "My Finance Friend", "Grocery Packs", "The SkyCo site"];

const field =
  "mt-1 min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Builds an email in the visitor's own mail app. Nothing is sent to or stored by SkyCo from this form. */
export function ContactForm({ initialProduct, initialTopic }: { initialProduct?: string; initialTopic?: string }) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [messageLength, setMessageLength] = useState(0);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const sentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem("skyco.contact.draft");
      if (draft && messageRef.current) { messageRef.current.value = draft; setMessageLength(draft.length); }
    } catch { /* Drafts are optional. */ }
  }, []);
  useEffect(() => { if (sent) sentRef.current?.focus(); }, [sent]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    if (String(d.get("website") ?? "") !== "") return;
    const message = String(d.get("message") ?? "").trim();
    if (message.length < 20 || message.length > 2000) {
      setError(message.length < 20 ? "Please write at least 20 characters so I know what happened." : "Please keep the message under 2000 characters.");
      messageRef.current?.focus();
      return;
    }
    setError("");
    const subject = `${d.get("topic")}: ${d.get("product")}`;
    const name = String(d.get("name") ?? "").trim();
    const body = `${message}\n\n${name ? `From: ${name}\n` : ""}Browser: ${navigator.userAgent}`;
    try { sessionStorage.removeItem("skyco.contact.draft"); } catch { /* Drafts are optional. */ }
    setSent(true);
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
      <form onSubmit={onSubmit} aria-describedby="contact-note" noValidate className="relative mt-5 grid gap-4 sm:grid-cols-2">
        <div className="text-sm font-semibold text-foreground">
          <label htmlFor="contact-topic">Topic</label>
          <select id="contact-topic" name="topic" defaultValue={topics.includes(initialTopic ?? "") ? initialTopic : "General"} className={field}>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="text-sm font-semibold text-foreground">
          <label htmlFor="contact-product">Product</label>
          <select id="contact-product" name="product" defaultValue={products.includes(initialProduct ?? "") ? initialProduct : products[0]} className={field}>
            {products.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="text-sm font-semibold text-foreground sm:col-span-2">
          <label htmlFor="contact-name">Your name (optional)</label>
          <input id="contact-name" name="name" autoComplete="name" className={field} />
        </div>
        <div className="text-sm font-semibold text-foreground sm:col-span-2">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message" name="message"
            ref={messageRef}
            onChange={event => { setMessageLength(event.target.value.length); try { sessionStorage.setItem("skyco.contact.draft", event.target.value); } catch { /* Drafts are optional. */ } }}
            maxLength={2000}
            rows={5}
            required
            aria-invalid={error ? true : undefined}
            aria-describedby="contact-count contact-error"
            className={field}
          />
        </div>
        <p id="contact-count" aria-live="polite" className="text-xs text-muted-foreground sm:col-span-2">{messageLength} of 2000 characters, at least 20</p>
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="contact-website">Leave this empty</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
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
      {sent && <div ref={sentRef} tabIndex={-1} role="status" className="mt-5 rounded-xl border border-sky-bright/30 bg-background p-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Your email app should now be open with the message ready. Press send there to deliver it.</div>}
      <p className="mt-4 text-sm text-muted-foreground">What happens next: any reply comes to the email address you send from.</p>
    </section>
  );
}
