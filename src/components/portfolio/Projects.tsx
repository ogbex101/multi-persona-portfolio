import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Reveal } from "./Reveal";
import { ExternalLink, ArrowUpRight, Figma } from "lucide-react";

/** Live-screenshot fallback for projects without an uploaded cover. */
function coverFor(p: any): string | null {
  if (p.media_url) return p.media_url;
  const link = p.external_link || p.figma_link;
  if (link && /^https?:\/\//i.test(link)) {
    return `https://image.thum.io/get/width/1200/crop/900/noanimate/${link}`;
  }
  return null;
}

export function Projects({ bundle, showAll = false }: { bundle: NicheBundle; showAll?: boolean }) {
  const limit = bundle.limits.projects ?? 6;
  const starred = bundle.projects.filter((p: any) => p.is_starred);
  const base = starred.length ? starred : bundle.projects;
  const list = showAll ? bundle.projects : base.slice(0, limit);
  if (list.length === 0) return null;

  const [featured, ...rest] = list;

  return (
    <SectionShell
      id="projects"
      eyebrow="Selected work"
      title="Projects I'm proud of."
      description="Real, shipped products — click through to explore them live."
      alt
      viewAllTo={!showAll ? "/niche/$slug/projects" : undefined}
      viewAllParams={!showAll ? { slug: bundle.niche.slug } : undefined}
    >
      {!showAll && featured && (
        <Reveal variant="up" className="mb-8">
          <FeaturedCard project={featured} />
        </Reveal>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(showAll ? list : rest).map((p: any, i: number) => (
          <Reveal key={p.id} variant={i % 2 === 0 ? "up" : "zoom"} delay={(i % 3) * 80}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function FeaturedCard({ project: p }: { project: any }) {
  const cover = coverFor(p);
  const link = p.external_link || p.figma_link;
  return (
    <article className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-smooth hover:shadow-elegant lg:grid-cols-2">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-auto">
        {cover ? (
          <img
            src={cover}
            alt={p.brand_name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full min-h-[18rem] w-full place-items-center bg-gradient-brand font-display text-5xl font-bold text-primary-foreground">
            {p.brand_name?.[0] ?? "?"}
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold shadow-soft backdrop-blur">
          Featured
        </span>
      </div>
      <div className="flex flex-col justify-center gap-4 p-7 lg:p-10">
        {p.category && (
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-accent-hex)]">
            {p.category}
          </div>
        )}
        <h3 className="font-display text-2xl font-bold sm:text-3xl">{p.brand_name}</h3>
        {p.description && <p className="text-muted-foreground">{p.description}</p>}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:opacity-95"
            >
              Visit site <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {p.figma_link && p.figma_link !== link && (
            <a
              href={p.figma_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-smooth hover:bg-muted"
            >
              <Figma className="h-4 w-4" /> Figma
            </a>
          )}
          {p.platform && <span className="text-xs text-muted-foreground">{p.platform}</span>}
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project: p }: { project: any }) {
  const cover = coverFor(p);
  const link = p.external_link || p.figma_link;
  const inner = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover}
            alt={p.brand_name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
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
        {link && (
          <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/95 px-3 py-1.5 text-xs font-semibold shadow-soft">
              Visit <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">{p.brand_name}</h3>
            {p.category && (
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</p>
            )}
          </div>
          {link && (
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          )}
        </div>
        {p.description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
        )}
      </div>
    </article>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  ) : (
    inner
  );
}
