import { ReactNode, useCallback, useEffect, useState } from "react";
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Spotlight carousel: shows one item at a time with a crossfade/glide, advances
 * on a timer, and exposes Pause / Play / Prev / Next + dot navigation. Used where
 * a single piece deserves focus (e.g. testimonials) — a different motion feel to
 * the continuous <Marquee>.
 */
export function Carousel<T>({
  items,
  renderItem,
  interval = 5500,
  className,
  ariaLabel,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  interval?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + n) % n), [n]);

  useEffect(() => {
    if (!playing || n <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), interval);
    return () => clearInterval(id);
  }, [playing, n, interval]);

  if (n === 0) return null;

  return (
    <div className={cn("relative", className)} role="group" aria-label={ariaLabel}>
      <div className="relative">
        {/* key re-mounts so the entrance animation replays each change */}
        <div key={index} className="reveal">
          {renderItem(items[index], index)}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-smooth hover:text-foreground hover:shadow-elegant"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-smooth hover:text-foreground hover:shadow-elegant"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-1.5 px-1">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index
                  ? "w-6 bg-[color:var(--brand-primary-hex)]"
                  : "w-2 bg-border hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-smooth hover:text-foreground hover:shadow-elegant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
