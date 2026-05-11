import type { NicheBundle } from "@/lib/niche-queries";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero({ bundle }: { bundle: NicheBundle }) {
  const s = bundle.settings as any;
  const bg = s?.hero_background_url;
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {bg && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 scale-105 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${bg})` }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--brand-accent-hex)_25%,transparent),transparent_60%)]" />
        </>
      )}
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28 lg:px-8 lg:py-32">
        <div className="space-y-6">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-[color:var(--brand-accent-hex)]" />
            {s?.title ?? bundle.niche.display_name}
          </div>
          <h1 className="reveal reveal-delay-1 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {s?.hero_tagline ?? "Crafting work that drives results."}
          </h1>
          <p className="reveal reveal-delay-2 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            {s?.bio}
          </p>
          <div className="reveal reveal-delay-3 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="group">
              <a href="#projects">
                See my work
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#contact">Get in touch</a>
            </Button>
          </div>
          <div className="reveal reveal-delay-4 flex flex-wrap gap-6 pt-4">
            <Stat label="Projects" value={s?.projects_count ?? 0} />
            <Stat label="Happy Clients" value={s?.happy_clients ?? 0} />
            <Stat label="Years Experience" value={s?.years_experience ?? 0} />
          </div>
        </div>

        <div className="reveal reveal-delay-2 relative">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 -rotate-6 rounded-3xl bg-gradient-brand opacity-20 blur-3xl animate-float" />
            <div className="absolute inset-0 rotate-3 rounded-3xl bg-gradient-brand opacity-30" />
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
              {s?.profile_picture_url ? (
                <img src={s.profile_picture_url} alt={s.full_name ?? ""} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-brand">
                  <span className="font-display text-7xl font-bold text-primary-foreground">
                    {(s?.full_name ?? "ODO").split(" ").map((n: string) => n[0]).join("").slice(0, 3)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold sm:text-3xl">{value}+</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
