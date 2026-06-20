import type { NicheBundle } from "@/lib/niche-queries";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { allNichesQuery } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Slideshow } from "./Slideshow";
import * as Icons from "lucide-react";
import { ArrowUpRight, Mail, LineChart, Boxes, Clapperboard, Sparkles } from "lucide-react";

const PRIMARY_SLUG = "fullstack-developer";

const NICHE_META: Record<string, { icon: any; blurb: string }> = {
  "email-marketer": { icon: Mail, blurb: "High-converting campaigns, flows & email design." },
  "forex-bot-creator": { icon: LineChart, blurb: "Automated trading bots & strategy systems." },
  "web3-developer": { icon: Boxes, blurb: "Smart contracts & decentralized apps." },
  "ai-video-editor": { icon: Clapperboard, blurb: "AI-assisted video editing & motion content." },
};

export function Services({ bundle }: { bundle: NicheBundle }) {
  const limit = bundle.limits.services ?? 6;
  const starred = bundle.services.filter((s: any) => s.is_starred);
  const list = (starred.length ? starred : bundle.services).slice(0, limit);

  const { data: niches = [] } = useQuery(allNichesQuery());
  const others = niches.filter((n) => n.slug !== PRIMARY_SLUG && n.slug !== bundle.niche.slug);

  if (list.length === 0 && others.length === 0) return null;

  return (
    <SectionShell
      id="services"
      eyebrow="What I do"
      title="Services tailored to your goals."
      description="End-to-end product work — from architecture and build to design, polish and launch."
      alt
    >
      {list.length > 0 && (
        <Slideshow
          items={list}
          ariaLabel="Services"
          perView={[1, 2, 3]}
          renderItem={(svc: any) => {
            const Icon = (Icons[svc.icon as keyof typeof Icons] as any) ?? Sparkles;
            return (
              <div
                key={svc.id}
                className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{svc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{svc.description}</p>
              </div>
            );
          }}
        />
      )}

      {others.length > 0 && (
        <div className="mt-14">
          <div className="mb-6 flex items-center gap-3">
            <h3 className="font-display text-lg font-semibold">Other things I do</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Slideshow
            items={others}
            ariaLabel="Other niches"
            perView={[1, 2, 4]}
            interval={6000}
            renderItem={(n: any) => {
              const meta = NICHE_META[n.slug] ?? {
                icon: Sparkles,
                blurb: "Explore this part of my work.",
              };
              const Icon = meta.icon;
              return (
                <Link
                  key={n.id}
                  to="/niche/$slug"
                  params={{ slug: n.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-soft transition-smooth hover:-translate-y-1 hover:border-[color:var(--brand-primary-hex)] hover:shadow-elegant"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card text-[color:var(--brand-primary-hex)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <h4 className="mt-4 font-semibold">{n.display_name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{meta.blurb}</p>
                </Link>
              );
            }}
          />
        </div>
      )}
    </SectionShell>
  );
}
