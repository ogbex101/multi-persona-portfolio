import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";

export function About({ bundle }: { bundle: NicheBundle }) {
  const s = bundle.settings;
  return (
    <SectionShell id="about" eyebrow="About me" title={`Hi, I'm ${s?.full_name ?? "Daniel"}.`} description={s?.bio ?? undefined} alt>
      <div className="grid gap-6 md:grid-cols-3">
        <Stat title="Projects Delivered" value={`${s?.projects_count ?? 0}+`} />
        <Stat title="Happy Clients" value={`${s?.happy_clients ?? 0}+`} />
        <Stat title="Years Experience" value={`${s?.years_experience ?? 0}+`} />
      </div>
    </SectionShell>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:shadow-elegant">
      <div className="font-display text-4xl font-bold text-[color:var(--brand-primary-hex)]">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{title}</div>
    </div>
  );
}
