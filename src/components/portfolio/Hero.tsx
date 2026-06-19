import { useEffect, useRef, useState } from "react";
import type { NicheBundle } from "@/lib/niche-queries";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2 } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const DEFAULT_STACK = [
  "React",
  "TypeScript",
  "Next.js",
  "Node",
  "Tailwind",
  "Supabase",
  "PostgreSQL",
  "Vite",
  "Framer Motion",
  "Cloudflare",
  "Stripe",
  "AI / LLMs",
];

export function Hero({ bundle }: { bundle: NicheBundle }) {
  const s = bundle.settings as any;
  const bg = s?.hero_background_url;
  const animationsOn = s?.animation_enabled !== false;
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Pointer-driven parallax: write unitless --mx/--my onto the scene; child
  // layers multiply by their own --depth so each plane shifts independently.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !animationsOn) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    let tx = 0,
      ty = 0;
    const onMove = (e: MouseEvent) => {
      const r = scene.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 100;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 100;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          scene.style.setProperty("--mx", tx.toFixed(2));
          scene.style.setProperty("--my", ty.toFixed(2));
          rafRef.current = null;
        });
      }
    };
    const onLeave = () => {
      scene.style.setProperty("--mx", "0");
      scene.style.setProperty("--my", "0");
    };
    scene.addEventListener("mousemove", onMove);
    scene.addEventListener("mouseleave", onLeave);
    return () => {
      scene.removeEventListener("mousemove", onMove);
      scene.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animationsOn]);

  const stack = (
    bundle.skills?.length ? bundle.skills.map((sk: any) => sk.name) : DEFAULT_STACK
  ).slice(0, 14);

  const initials = (s?.full_name ?? "Ogbeifun Daniel")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 3);

  return (
    <section
      ref={sceneRef}
      className="scene-3d relative overflow-hidden bg-gradient-hero"
      style={{ ["--mx" as any]: "0", ["--my" as any]: "0" }}
    >
      {/* Animated gradient mesh */}
      <div
        aria-hidden
        className="animate-mesh pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(40% 50% at 20% 25%, color-mix(in oklab, var(--brand-primary-hex) 30%, transparent), transparent 70%), radial-gradient(35% 45% at 85% 30%, color-mix(in oklab, var(--brand-accent-hex) 28%, transparent), transparent 70%), radial-gradient(45% 55% at 60% 90%, color-mix(in oklab, var(--brand-primary-hex) 20%, transparent), transparent 70%)",
        }}
      />
      {/* Subtle moving grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in oklab, var(--brand-primary-hex) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--brand-primary-hex) 40%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          transform: "translate3d(calc(var(--mx) * 0.15px), calc(var(--my) * 0.15px), 0)",
          maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
        }}
      />
      {bg && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-25"
            style={{
              backgroundImage: `url(${bg})`,
              transform:
                "translate3d(calc(var(--mx) * -0.25px), calc(var(--my) * -0.25px), 0) scale(1.1)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background"
          />
        </>
      )}

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28 lg:px-8 lg:py-32">
        {/* Copy */}
        <div className="space-y-6">
          <div className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--brand-accent-hex)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--brand-accent-hex)]" />
            </span>
            {s?.title ?? bundle.niche.display_name}
          </div>

          <h1 className="reveal reveal-delay-1 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {s?.hero_tagline ?? "I design, build & ship full-stack products."}
          </h1>

          <p className="reveal reveal-delay-2 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            {s?.bio ??
              "Full-stack developer and vibe coder turning ideas into polished, production-grade web apps — fast."}
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

        {/* 3D visual */}
        <div className="reveal reveal-delay-2 relative">
          <div
            className="relative mx-auto aspect-square w-full max-w-md"
            style={{
              transform: "rotateX(calc(var(--my) * -0.12deg)) rotateY(calc(var(--mx) * 0.16deg))",
              transformStyle: "preserve-3d",
              transition: "transform 250ms var(--transition-smooth)",
            }}
          >
            {/* glow + rotating ring (deep layers) */}
            <div
              aria-hidden
              className="animate-orb-a absolute -left-6 top-2 h-40 w-40 rounded-full bg-[color:var(--brand-primary-hex)] opacity-30 blur-3xl"
              style={{
                transform: "translate3d(calc(var(--mx) * 0.5px), calc(var(--my) * 0.5px), -120px)",
              }}
            />
            <div
              aria-hidden
              className="animate-orb-b absolute -right-4 bottom-4 h-44 w-44 rounded-full bg-[color:var(--brand-accent-hex)] opacity-30 blur-3xl"
              style={{
                transform: "translate3d(calc(var(--mx) * 0.4px), calc(var(--my) * 0.4px), -120px)",
              }}
            />
            <div
              aria-hidden
              className="animate-spin-slow absolute inset-2 rounded-full border border-dashed border-[color:var(--brand-primary-hex)]/30"
              style={{ transform: "translateZ(-60px)" }}
            />

            {/* profile card */}
            <div
              className="absolute inset-6 overflow-hidden rounded-[2rem] border border-border bg-card shadow-elegant"
              style={{ transform: "translateZ(40px)" }}
            >
              {s?.profile_picture_url ? (
                <img
                  src={s.profile_picture_url}
                  alt={s.full_name ?? ""}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-brand">
                  <span className="font-display text-7xl font-bold text-primary-foreground">
                    {initials}
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[color:var(--brand-primary-hex)]/10 to-transparent" />
            </div>

            {/* floating glass chips (foreground layers) */}
            <FloatChip
              className="left-0 top-10"
              z={90}
              icon={<Code2 className="h-3.5 w-3.5" />}
              label="Vibe coding"
            />
            <FloatChip
              className="-right-2 top-1/3"
              z={110}
              icon={<Sparkles className="h-3.5 w-3.5" />}
              label="Ships fast"
            />
            <FloatChip className="bottom-8 left-4" z={100} label="Full-stack" />
          </div>

          {/* gliding tech rail */}
          <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
            <div className="badge-glide">
              {[...stack, ...stack].map((t, i) => (
                <span
                  key={i}
                  className="shrink-0 whitespace-nowrap rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatChip({
  className,
  label,
  icon,
  z,
}: {
  className?: string;
  label: string;
  icon?: React.ReactNode;
  z: number;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        transform: `translate3d(calc(var(--mx) * ${(z / 60).toFixed(2)}px), calc(var(--my) * ${(z / 60).toFixed(2)}px), ${z}px)`,
      }}
    >
      <div className="animate-float flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold shadow-elegant backdrop-blur">
        {icon}
        {label}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const display = useCountUp(value, inView);
  return (
    <div ref={ref}>
      <div className="font-display text-2xl font-bold sm:text-3xl">{display}+</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function useCountUp(target: number, start: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}
