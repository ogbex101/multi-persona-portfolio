import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";

export function EmailDesigns({ bundle, showAll = false }: { bundle: NicheBundle; showAll?: boolean }) {
  if (bundle.niche.slug !== "email-marketer") return null;
  const limit = bundle.limits.email_designs ?? 6;
  const starred = bundle.emailDesigns.filter((e: any) => e.is_starred);
  const list = showAll ? bundle.emailDesigns : (starred.length ? starred : bundle.emailDesigns).slice(0, limit);
  if (list.length === 0) return null;
  return (
    <SectionShell
      id="email-designs"
      eyebrow="Email designs"
      title="Hero sections & layouts."
      description="A gallery of high-converting email designs across welcome, promo, and lifecycle programs."
      alt
      viewAllTo={!showAll ? "/niche/$slug/email-designs" : undefined}
      viewAllParams={!showAll ? { slug: bundle.niche.slug } : undefined}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e: any) => (
          <article key={e.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <img src={e.preview_url} alt={e.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold">{e.title}</h3>
              {e.client_name && <p className="text-xs uppercase tracking-wider text-muted-foreground">{e.client_name}</p>}
              {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
