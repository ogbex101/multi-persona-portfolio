import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";

export function Skills({ bundle }: { bundle: NicheBundle }) {
  if (bundle.skills.length === 0) return null;
  return (
    <SectionShell id="skills" eyebrow="Skills" title="Tools and techniques I rely on.">
      <div className="grid gap-5 sm:grid-cols-2">
        {bundle.skills.map((skill: any) => (
          <div key={skill.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">{skill.percentage}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-1000"
                style={{ width: `${skill.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
