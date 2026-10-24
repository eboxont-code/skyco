import { useState, useRef } from "react";
import { Send, MessageCircleHeart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useWebMCPTools, text } from "@/lib/webmcp";

export function HelpSection() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const openMail = (name: string, email: string, message: string) => {
    const subject = encodeURIComponent(`SkyCo enquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(
      `Hi,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`
    );
    window.location.href = `mailto:support@skyco.online?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    openMail(
      String(data.get("name") ?? "").trim(),
      String(data.get("email") ?? "").trim(),
      String(data.get("message") ?? "").trim(),
    );
  };

  // WebMCP: let an AI agent fill and submit this form without scraping the DOM.
  useWebMCPTools([
    {
      name: "contact_skyco",
      description:
        "Send a message to SkyCo (support@skyco.online) about feedback, a product idea, a bug in a SkyCo product, or working together. Opens the visitor's mail app with the message prepared.",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name of the person getting in touch.", minLength: 1, maxLength: 100 },
          email: { type: "string", format: "email", description: "Email address SkyCo should reply to." },
          message: { type: "string", description: "The message to send.", minLength: 1, maxLength: 4000 },
        },
        required: ["name", "email", "message"],
        additionalProperties: false,
      },
      execute: async (args) => {
        const name = String(args["name"] ?? "").trim();
        const email = String(args["email"] ?? "").trim();
        const message = String(args["message"] ?? "").trim();
        if (!name || !email || !message) {
          return text("name, email and message are all required.");
        }
        const form = formRef.current;
        if (form) {
          (form.elements.namedItem("name") as HTMLInputElement | null)?.setAttribute("value", name);
          (form.elements.namedItem("email") as HTMLInputElement | null)?.setAttribute("value", email);
        }
        openMail(name, email, message);
        return text(`Prepared an email to support@skyco.online from ${name} (${email}).`);
      },
    },
  ]);

  return (
    <section id="help" aria-labelledby="help-heading" className="px-6 py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-start">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-bright to-sky-azure text-white">
            <MessageCircleHeart className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-sky-bright">Contact SkyCo</p>
          <h2 id="help-heading" className="mt-3 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Get in <span className="text-gradient-sky">touch</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Feedback, product ideas and partnership questions all reach the same inbox at
            support@skyco.online, and I read every message.
          </p>
          <ul className="mt-6 space-y-3 text-base text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-bright"/> Request a tool you wish existed</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-azure"/> Report a bug in one of my live products</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-deep"/> Talk to me about working together</li>
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
              Your mail app should have opened with the message ready to send. Send it and I will
              reply as soon as I can.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            name="contact_skyco"
            aria-label="Contact SkyCo"
            data-webmcp-tool="contact_skyco"
            data-webmcp-description="Send a message to SkyCo about feedback, product ideas, bugs or working together."
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
                autoComplete="name"
                data-webmcp-param="name"
                placeholder="Who am I speaking with?"
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
                autoComplete="email"
                data-webmcp-param="email"
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
                data-webmcp-param="message"
                placeholder="What's on your mind?"
                required
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-sky-deep text-primary-foreground hover:bg-sky-azure shadow-glow-cyan"
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
