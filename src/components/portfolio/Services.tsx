import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import * as Icons from "lucide-react";

export function Services({ bundle }: { bundle: NicheBundle }) {
  const limit = bundle.limits.services ?? 6;
  const items = bundle.services
    .filter((s: any) => s.is_starred)
    .slice(0, limit);
  const list = items.length ? items : bundle.services.slice(0, limit);
  if (list.length === 0) return null;

  return (
    <SectionShell
      id="services"
      eyebrow="What I do"
      title="Services tailored to your goals."
      description="End-to-end execution backed by deep expertise — strategy, delivery, and measurement."
      alt
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((svc: any) => {
          const Icon = (Icons[svc.icon as keyof typeof Icons] as any) ?? Icons.Star;
          return (
            <div
              key={svc.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{svc.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{svc.description}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
