import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { ExternalLink } from "lucide-react";

export function Projects({ bundle, showAll = false }: { bundle: NicheBundle; showAll?: boolean }) {
  const limit = bundle.limits.projects ?? 6;
  const starred = bundle.projects.filter((p: any) => p.is_starred);
  const list = showAll
    ? bundle.projects
    : (starred.length ? starred : bundle.projects).slice(0, limit);
  if (list.length === 0) return null;

  return (
    <SectionShell
      id="projects"
      eyebrow="Selected work"
      title="Projects I'm proud of."
      description="A snapshot of recent work across the niche."
      alt
      viewAllTo={!showAll ? "/niche/$slug/projects" : undefined}
      viewAllParams={!showAll ? { slug: bundle.niche.slug } : undefined}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p: any) => (
          <article
            key={p.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {p.media_url ? (
                <img
                  src={p.media_url}
                  alt={p.brand_name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-brand font-display text-3xl font-bold text-primary-foreground">
                  {p.brand_name?.[0] ?? "?"}
                </div>
              )}
              {p.platform && (
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
                  {p.platform}
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{p.brand_name}</h3>
                  {p.category && <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</p>}
                </div>
                {(p.external_link || p.figma_link) && (
                  <a
                    href={p.external_link || p.figma_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {p.description && <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
