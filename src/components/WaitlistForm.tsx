import { useState } from "react";

/**
 * Soft gate for an upcoming product. There is no database on this site, so the
 * form opens a prefilled email to support@skyco.online.
 */
export function WaitlistForm({ productName }: { productName: string }) {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid email address."); return; }
    setError("");
    const body = [
      `Please add me to the ${productName} waitlist.`,
      "",
      `Name: ${name || "(not given)"}`,
      `Email: ${email}`,
    ].join("\n");
    window.location.href = `mailto:support@skyco.online?subject=${encodeURIComponent(
      `${productName} waitlist`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="mt-4 space-y-2">
      <label className="block text-xs font-semibold text-foreground" htmlFor={`wl-email-${slug}`}>
        Get an email when it opens
      </label>
      <label htmlFor={`wl-name-${slug}`} className="block text-xs font-semibold text-foreground">Name (optional)</label>
      <input
        id={`wl-name-${slug}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (optional)"
        className="min-h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring"
      />
      <input
        id={`wl-email-${slug}`}
        type="email"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `wl-error-${slug}` : undefined}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="min-h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring"
      />
      {error && <p id={`wl-error-${slug}`} role="alert" className="text-xs text-destructive">{error}</p>}
      <button
        type="submit"
        className="min-h-11 w-full rounded-lg bg-sky-deep px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-sky-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Join the waitlist
      </button>
      <p role="status" className="text-[11px] leading-relaxed text-muted-foreground">
        {sent
          ? "Your email app should be open with the message ready. Send it and I will add you."
          : "This opens an email to support@skyco.online. I only use it to tell you when this product is ready."}
      </p>
    </form>
  );
}
