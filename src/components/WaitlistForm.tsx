import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/lib/waitlist.functions";
import { waitlistSchema } from "@/lib/waitlist-schema";

/**
 * Stored interest in upcoming products. Account sync is not available yet.
 */
export function WaitlistForm({ productName }: { productName: string }) {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const emailError = emailTouched && !waitlistSchema.shape.email.safeParse(email).success ? "Enter a valid email address." : "";
  const submit = useServerFn(joinWaitlist);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setEmailTouched(true);
    const parsed = waitlistSchema.safeParse({ product: productName, name, email });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check your details."); return; }
    setError("");
    setPending(true);
    try {
      const result = await submit({ data: parsed.data });
      if (result.ok) setSent(true);
      else setError("Your details could not be saved. Please try again.");
    } catch { setError("Your details could not be saved. Please try again."); }
    finally { setPending(false); }
  };

  return (
    <form noValidate onSubmit={onSubmit} className="mt-4 space-y-2">
      <label className="block text-xs font-semibold text-foreground" htmlFor={`wl-email-${slug}`}>
        Get an email when it opens
      </label>
      <label htmlFor={`wl-name-${slug}`} className="block text-xs font-semibold text-foreground">Name (optional)</label>
      <input
        id={`wl-name-${slug}`}
        maxLength={100}
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name (optional)"
        className="min-h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring"
      />
      <input
        id={`wl-email-${slug}`}
        type="email"
        maxLength={255}
        autoComplete="email"
        aria-invalid={Boolean(emailError)}
        aria-describedby={emailError ? `wl-email-error-${slug}` : undefined}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setEmailTouched(true)}
        placeholder="you@example.com"
        className="min-h-11 w-full rounded-lg border border-sky-bright/30 bg-background px-3 text-sm outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring"
      />
      {emailError && <p id={`wl-email-error-${slug}`} role="alert" className="text-sm text-destructive">{emailError}</p>}
      {error && !emailError && <p id={`wl-error-${slug}`} role="alert" className="text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        disabled={pending || sent}
        className="min-h-11 w-full rounded-lg bg-sky-deep px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-sky-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {pending ? "Saving" : sent ? "Joined" : "Join the waitlist"}
      </Button>
      <p role="status" className="text-[11px] leading-relaxed text-muted-foreground">
        {sent
          ? "Your interest has been saved."
          : "I store your name, email and chosen product for its waitlist."}
      </p>
    </form>
  );
}
