import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Continuous "gliding" rail. Content scrolls seamlessly (the set is rendered
 * twice and wrapped). The client can Pause / Play and nudge to the Next item —
 * the nudge is an eased glide that works even while paused.
 *
 * Driven by requestAnimationFrame so play/pause/next never fight each other.
 */
export function Marquee<T>({
  items,
  renderItem,
  speed = 40,
  direction = "left",
  gap = 20,
  step = 300,
  controls = true,
  paused,
  nudgeSignal,
  ariaLabel,
  className,
  itemClassName,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  speed?: number; // px per second
  direction?: "left" | "right";
  gap?: number; // px
  step?: number; // px nudged per "next"
  controls?: boolean;
  /** When provided, play/pause is controlled by the parent and built-in controls are hidden. */
  paused?: boolean;
  /** Change this number to nudge to the next item (used with controlled `paused`). */
  nudgeSignal?: number;
  ariaLabel?: string;
  className?: string;
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0);
  const halfRef = useRef(0);
  const pendingRef = useRef(0);
  const playingRef = useRef(true);
  const hoverRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const firstNudge = useRef(true);
  const [playing, setPlaying] = useState(true);

  const controlled = paused !== undefined;
  const sign = direction === "left" ? 1 : -1;

  useEffect(() => {
    if (paused !== undefined) pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (firstNudge.current) {
      firstNudge.current = false;
      return;
    }
    if (nudgeSignal !== undefined) pendingRef.current += step;
  }, [nudgeSignal, step]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (track) halfRef.current = track.scrollWidth / 2;
  }, []);

  useEffect(() => {
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, items.length]);

  useEffect(() => {
    const tick = (now: number) => {
      const last = lastRef.current ?? now;
      const dt = Math.min(0.05, (now - last) / 1000); // clamp for tab switches
      lastRef.current = now;

      const half = halfRef.current;
      if (half > 0) {
        const isPlaying = controlled ? !pausedRef.current : playingRef.current;
        const auto = isPlaying && !hoverRef.current ? speed * dt : 0;
        let nudge = 0;
        if (pendingRef.current > 0) {
          nudge = Math.min(pendingRef.current, Math.max(step * 2.2, 700) * dt);
          pendingRef.current -= nudge;
        }
        let pos = posRef.current - sign * (auto + nudge);
        if (pos <= -half) pos += half;
        if (pos > 0) pos -= half;
        posRef.current = pos;
        const track = trackRef.current;
        if (track) track.style.transform = `translate3d(${pos}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastRef.current = null;
    };
  }, [speed, sign, step, controlled]);

  const toggle = () => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  };
  const next = () => {
    pendingRef.current += step;
  };

  // duplicate the set so the wrap is seamless
  const doubled = [...items, ...items];

  return (
    <div className={cn("relative", className)}>
      <div
        className="glide-mask overflow-hidden"
        onMouseEnter={() => (hoverRef.current = true)}
        onMouseLeave={() => (hoverRef.current = false)}
        role="group"
        aria-label={ariaLabel}
      >
        <div ref={trackRef} className="flex w-max" style={{ gap }}>
          {doubled.map((item, i) => (
            <div key={i} className={cn("shrink-0", itemClassName)} aria-hidden={i >= items.length}>
              {renderItem(item, i % items.length)}
            </div>
          ))}
        </div>
      </div>

      {controls && !controlled && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-smooth hover:text-foreground hover:shadow-elegant"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-smooth hover:text-foreground hover:shadow-elegant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
