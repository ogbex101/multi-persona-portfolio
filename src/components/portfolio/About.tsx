import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Reveal } from "./Reveal";
import { Code2, Rocket, Palette, Gauge } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "End-to-end builder",
    text: "Frontend, backend, database and deploy — I own the whole stack so nothing falls through the cracks.",
  },
  {
    icon: Palette,
    title: "Design-minded",
    text: "Every build ships with a real sense of layout, motion and polish, not just working code.",
  },
  {
    icon: Rocket,
    title: "Vibe-coded velocity",
    text: "I move from idea to live URL fast, iterating in tight loops with AI in the cockpit.",
  },
  {
    icon: Gauge,
    title: "Performance first",
    text: "Snappy, accessible, SEO-friendly apps that feel great on every device.",
  },
];

export function About({ bundle }: { bundle: NicheBundle }) {
  const s = bundle.settings as any;
  const name = s?.full_name ?? "Ogbeifun Daniel";
  const bio =
    s?.bio ??
    "I'm a full-stack developer and vibe coder who turns rough ideas into polished, production-ready web apps. I care about the details most people skip — the motion, the empty states, the load times — because that's what makes software feel premium.";

  return (
    <SectionShell id="about" eyebrow="About me" title={`Hi, I'm ${name}.`} description={bio} alt>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <Reveal variant="left" className="lg:col-span-5">
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[2rem] bg-gradient-brand opacity-15 blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border bg-gradient-brand shadow-elegant">
              {s?.profile_picture_url ? (
                <img
                  src={s.profile_picture_url}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center font-display text-6xl font-bold text-primary-foreground">
                  {name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 3)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-6 rounded-2xl border border-border bg-card px-6 py-3 shadow-elegant">
              {[
                ["Projects", s?.projects_count],
                ["Clients", s?.happy_clients],
                ["Years", s?.years_experience],
              ].map(([label, v]) => (
                <div key={label} className="text-center">
                  <div className="font-display text-xl font-bold text-[color:var(--brand-primary-hex)]">
                    {v ?? 0}+
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:pt-2">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon;
            return (
              <Reveal key={h.title} variant="up" delay={i * 90}>
                <div className="group h-full rounded-2xl border border-border bg-card p-5 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{h.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{h.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
