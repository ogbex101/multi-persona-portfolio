import { useState } from "react";
import type { NicheBundle } from "@/lib/niche-queries";
import { Pause, Play, ChevronRight } from "lucide-react";
import { SectionShell } from "./SectionShell";
import { Marquee } from "./Marquee";

const DEFAULT_TOOLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express",
  "Tailwind CSS",
  "shadcn/ui",
  "Framer Motion",
  "GSAP",
  "Three.js",
  "Vite",
  "React Query",
  "Zustand",
  "Redux",
  "Zod",
  "Supabase",
  "PostgreSQL",
  "MongoDB",
  "Firebase",
  "Prisma",
  "REST APIs",
  "GraphQL",
  "WebSockets",
  "Stripe",
  "Docker",
  "Git",
  "GitHub",
  "Vercel",
  "Cloudflare",
  "Netlify",
  "Python",
  "Figma",
  "Cursor",
  "Lovable",
  "AI / LLMs",
];

export function Tools({ bundle }: { bundle: NicheBundle }) {
  const [paused, setPaused] = useState(false);
  const [nudge, setNudge] = useState(0);

  const fromDb = bundle.skills?.map((s: any) => s.name).filter(Boolean) ?? [];
  const seen = new Set(fromDb.map((t: string) => t.toLowerCase()));
  const tools = [...fromDb, ...DEFAULT_TOOLS.filter((t) => !seen.has(t.toLowerCase()))];

  if (tools.length === 0) return null;

  // two rows gliding in opposite directions, driven by one shared control bar
  const rowA = tools.filter((_, i) => i % 2 === 0);
  const rowB = tools.filter((_, i) => i % 2 === 1);

  return (
    <SectionShell
      id="tools"
      eyebrow="My toolkit"
      title="Tools I build with."
      description="The stack I reach for to design, build and ship — gliding by below. Pause it to take a closer look."
    >
      <div className="space-y-4">
        <Marquee
          items={rowA}
          ariaLabel="Tools, row one"
          direction="left"
          speed={32}
          paused={paused}
          nudgeSignal={nudge}
          renderItem={(t) => <ToolChip label={t} />}
        />
        <Marquee
          items={rowB}
          ariaLabel="Tools, row two"
          direction="right"
          speed={32}
          paused={paused}
          nudgeSignal={nudge}
          renderItem={(t) => <ToolChip label={t} />}
        />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play" : "Pause"}
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-smooth hover:text-foreground hover:shadow-elegant"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => setNudge((n) => n + 1)}
          aria-label="Next"
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-smooth hover:text-foreground hover:shadow-elegant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </SectionShell>
  );
}

function ToolChip({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-soft transition-smooth hover:border-[color:var(--brand-primary-hex)] hover:shadow-elegant">
      <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-brand" />
      <span className="whitespace-nowrap text-sm font-medium">{label}</span>
    </div>
  );
}
