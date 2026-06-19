import { useState } from "react";
import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageCircle, MapPin, Send, ArrowUpRight } from "lucide-react";

export function Contact({ bundle }: { bundle: NicheBundle }) {
  const s = bundle.settings as any;
  if (!s) return null;

  const methods = [
    s.email && { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    s.phone && { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone}` },
    s.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: s.whatsapp,
      href: `https://wa.me/${s.whatsapp.replace(/[^\d]/g, "")}`,
    },
    s.location && { icon: MapPin, label: "Location", value: s.location, href: undefined },
  ].filter(Boolean) as Array<{ icon: any; label: string; value: string; href?: string }>;

  return (
    <SectionShell
      id="contact"
      eyebrow="Get in touch"
      title="Let's build something great."
      description="Available for new projects and collaborations. Tell me what you're working on and I'll reply within 24 hours."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <Reveal variant="left" className="lg:col-span-5">
          <div className="flex h-full flex-col gap-4">
            {methods.map((it) => {
              const Icon = it.icon;
              const inner = (
                <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-elegant">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {it.label}
                    </div>
                    <div className="truncate font-medium">{it.value}</div>
                  </div>
                  {it.href && (
                    <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </div>
              );
              return it.href ? (
                <a
                  key={it.label}
                  href={it.href}
                  target={it.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <div key={it.label}>{inner}</div>
              );
            })}

            {bundle.socialLinks.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {bundle.socialLinks.map((l: any) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft transition-smooth hover:border-[color:var(--brand-primary-hex)] hover:shadow-elegant"
                  >
                    {l.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal variant="right" className="lg:col-span-7">
          <ContactForm toEmail={s.email} />
        </Reveal>
      </div>
    </SectionShell>
  );
}

function ContactForm({ toEmail }: { toEmail?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`New project enquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nBudget: ${budget || "—"}\n\n${message}`,
    );
    const target = toEmail || "";
    window.location.href = `mailto:${target}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-border bg-card p-6 shadow-elegant sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c-name">Name</Label>
          <Input
            id="c-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input
            id="c-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="c-budget">Budget (optional)</Label>
        <Input
          id="c-budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="$2k – $5k"
        />
      </div>
      <div className="mt-4">
        <Label htmlFor="c-message">Project details</Label>
        <Textarea
          id="c-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me about your idea, goals and timeline…"
          required
        />
      </div>
      <Button type="submit" size="lg" className="group mt-5 w-full sm:w-auto">
        Send message
        <Send className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        This opens your email app pre-filled. Prefer chat? Use any method on the left.
      </p>
    </form>
  );
}
