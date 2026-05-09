import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Star, Quote } from "lucide-react";

export function Testimonials({ bundle, showAll = false }: { bundle: NicheBundle; showAll?: boolean }) {
  const limit = bundle.limits.testimonials ?? 6;
  const starred = bundle.testimonials.filter((t: any) => t.is_starred);
  const list = showAll ? bundle.testimonials : (starred.length ? starred : bundle.testimonials).slice(0, limit);
  if (list.length === 0) return null;
  return (
    <SectionShell
      id="testimonials"
      eyebrow="Praise"
      title="What clients are saying."
      alt
      viewAllTo={!showAll ? "/niche/$slug/testimonials" : undefined}
      viewAllParams={!showAll ? { slug: bundle.niche.slug } : undefined}
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t: any) => (
          <figure key={t.id} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:shadow-elegant">
            <Quote className="absolute right-5 top-5 h-8 w-8 text-[color:var(--brand-accent-hex)] opacity-40" />
            <div className="mb-3 flex gap-0.5 text-[color:var(--brand-accent-hex)]">
              {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed text-foreground">"{t.review_text}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              {t.photo_url ? (
                <img src={t.photo_url} alt={t.client_name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand font-bold text-primary-foreground">
                  {t.client_name?.[0]}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold">{t.client_name}</div>
                {t.role && <div className="text-xs text-muted-foreground">{t.role}</div>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
