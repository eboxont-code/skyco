import { useState } from "react";
import { Send, MessageCircleHeart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function HelpSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Hello from ${name || "a friend"} on SkyCo`);
    const body = encodeURIComponent(
      `Hi,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`
    );
    window.location.href = `mailto:support@skyco.online?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="help" className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-start">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-bright to-sky-azure text-white">
            <MessageCircleHeart className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Say hello</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Come say <span className="text-gradient-sky">hi</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            I'd genuinely love to hear from you. Feedback, ideas, or a
            friendly hello all land in the same inbox and I read every one.
          </p>
          <ul className="mt-6 space-y-3 text-base text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-bright"/> Tell me about a tool you wish existed</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-azure"/> Share something that would make your day easier</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-deep"/> Or just say hi. That works too.</li>
          </ul>
        </div>

        <div>
        {submitted ? (
          <div className="rounded-2xl border border-sky-bright/30 bg-card p-8 text-center shadow-glow-cyan">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-bright to-sky-azure text-white">
              <Send className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              Thanks for that
            </h3>
            <p className="mt-2 text-muted-foreground">
              Your mail app should have opened with your message ready to
              send. Hit send and I'll get back to you as soon as I can.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-sky-bright/25 bg-card p-6 shadow-sm"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Your name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="What can I call you?"
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Your message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="What's on your mind?"
                required
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-sky-deep text-primary-foreground hover:bg-sky-azure shadow-glow-cyan"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>
        )}
        </div>
      </div>
    </section>
  );
}
