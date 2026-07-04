import { useState } from "react";
import { Send, MessageCircleHeart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function HelpSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="help" className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-light text-sky-deep">
          <MessageCircleHeart className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ask for a little help
        </h2>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Sometimes you just need a quick answer, a suggestion, or someone to
          point you in a better direction. Send a message — we&apos;re listening.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-lg">
        {submitted ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-light text-sky-deep">
              <Send className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              Message sent
            </h3>
            <p className="mt-2 text-muted-foreground">
              Thanks for reaching out. We&apos;ll read every word and get back to you
              as soon as we can.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-border bg-card p-8"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Your name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="What should we call you?"
                required
                className="rounded-xl"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
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
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Your message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="What would you like help with?"
                required
                rows={4}
                className="rounded-xl resize-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-sky-deep text-primary-foreground hover:bg-sky-deep/90"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
