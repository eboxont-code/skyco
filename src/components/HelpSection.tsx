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
    const subject = encodeURIComponent(`SkyCo enquiry from ${name || "a visitor"}`);
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
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Contact SkyCo</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Get in <span className="text-gradient-sky">touch</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Feedback, product ideas and partnership questions all reach the same inbox at
            support@skyco.online, and we read every message.
          </p>
          <ul className="mt-6 space-y-3 text-base text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-bright"/> Request a tool you wish existed</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-azure"/> Report a bug in one of our live products</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-deep"/> Talk to us about working together</li>
          </ul>
        </div>

        <div>
        {submitted ? (
          <div className="rounded-2xl border border-sky-bright/30 bg-card p-8 text-center shadow-glow-cyan">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-bright to-sky-azure text-white">
              <Send className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              Thanks for reaching out
            </h3>
            <p className="mt-2 text-muted-foreground">
              Your mail app should have opened with the message ready to send. Send it and we will
              reply as soon as we can.
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
                placeholder="Who are we speaking with?"
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
