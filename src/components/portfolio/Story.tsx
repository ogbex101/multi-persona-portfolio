import { useState } from "react";
import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Reveal } from "./Reveal";
import { Quote, ArrowDown, Sparkles } from "lucide-react";

const DEFAULT_STORY = `My story doesn't start with a computer science degree — it starts with curiosity and a stubborn refusal to accept "that's just how it works."

I taught myself to build by breaking things: pulling apart websites to see what made them tick, rebuilding them until the pixels lined up, then asking how to make them faster, cleaner, more alive. Somewhere in those late nights, coding stopped feeling like work and started feeling like play. That's the "vibe coder" in me — I build in a flow state, fast and intentional, treating every project like a craft instead of a checklist.

Over the years that curiosity turned into a real skill set: full-stack web apps, real-time platforms, e-commerce, dashboards, streaming products — front to back, idea to deploy. I learned to care about the things users never name but always feel: the smoothness of a transition, the speed of a first load, the small moment of delight when something just works.

What drives me now is the same thing that started it all: taking a half-formed idea and turning it into something real, polished, and live on the internet. I partner with founders and teams who want more than "a developer" — they want someone who treats their product like their own.

If you've got an idea worth building, I'd love to help you ship it.`;

export function Story({ bundle }: { bundle: NicheBundle }) {
  const [expanded, setExpanded] = useState(false);
  const text = bundle.story?.story_text?.trim() || DEFAULT_STORY;
  const quote = bundle.story?.quote ?? "Build like it's yours. Ship like it matters.";
  const image = bundle.story?.image_url ?? (bundle.settings as any)?.profile_picture_url;

  const paragraphs: string[] = text
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);
  const preview = paragraphs.slice(0, 2);
  const rest = paragraphs.slice(2);
  const hasMore = rest.length > 0;

  return (
    <SectionShell id="story" eyebrow="My story" title="The path that brought me here.">
      <div className="grid gap-8 md:grid-cols-5 md:gap-12">
        <Reveal variant="left" className="md:col-span-3">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-[color:var(--brand-primary-hex)]">
              <Sparkles className="h-3.5 w-3.5" /> A quick read
            </div>

            {preview.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-muted-foreground text-balance">
                {p}
              </p>
            ))}

            {hasMore && (
              <div
                className={`grid transition-all duration-700 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="space-y-5 overflow-hidden">
                  {rest.map((p, i) => (
                    <p
                      key={i}
                      className="text-lg leading-relaxed text-muted-foreground text-balance"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {hasMore && !expanded && (
              <div className="relative">
                <div
                  className="pointer-events-none absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"
                  aria-hidden
                />
                <button
                  onClick={() => setExpanded(true)}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:opacity-95"
                >
                  Continue reading
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                </button>
              </div>
            )}

            <blockquote className="relative mt-2 rounded-2xl border-l-4 border-[color:var(--brand-primary-hex)] bg-card p-6 font-display text-xl italic shadow-soft">
              <Quote className="absolute -left-2 -top-2 h-6 w-6 text-[color:var(--brand-accent-hex)]" />
              {quote}
            </blockquote>
          </div>
        </Reveal>

        <Reveal variant="right" className="md:col-span-2">
          <div className="md:sticky md:top-24">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-gradient-brand shadow-elegant">
              {image ? (
                <img src={image} alt="My story" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-primary-foreground">
                  <Quote className="h-16 w-16 opacity-30" />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
