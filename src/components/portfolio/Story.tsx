import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Quote } from "lucide-react";

export function Story({ bundle }: { bundle: NicheBundle }) {
  if (!bundle.story?.story_text) return null;
  return (
    <SectionShell id="story" eyebrow="My story" title="The path that brought me here.">
      <div className="grid gap-8 md:grid-cols-5 md:gap-12">
        <div className="md:col-span-3 space-y-5">
          <p className="text-lg leading-relaxed text-muted-foreground text-balance">{bundle.story.story_text}</p>
          {bundle.story.quote && (
            <blockquote className="relative rounded-2xl border-l-4 border-[color:var(--brand-primary-hex)] bg-card p-6 font-display text-xl italic shadow-soft">
              <Quote className="absolute -left-2 -top-2 h-6 w-6 text-[color:var(--brand-accent-hex)]" />
              {bundle.story.quote}
            </blockquote>
          )}
        </div>
        <div className="md:col-span-2">
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-gradient-brand shadow-elegant">
            {bundle.story.image_url ? (
              <img src={bundle.story.image_url} alt="My story" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-primary-foreground">
                <Quote className="h-16 w-16 opacity-30" />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
