import { ReactNode, useEffect, useState } from "react";
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function usePerView([base, sm, lg]: [number, number, number]) {
  const [pv, setPv] = useState(base);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPv(w >= 1024 ? lg : w >= 640 ? sm : base);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [base, sm, lg]);
  return pv;
}

/**
 * Paged slideshow: chunks a list into pages and toggles from one page to the
 * next with a sliding transition, auto-advancing on a timer. Pause / Play /
 * Prev / Next + dots. Used for list-style sections so they never read as a
 * long static list.
 */
export function Slideshow<T>({
  items,
  renderItem,
  perView = [1, 2, 3],
  interval = 5000,
  gap = 24,
  ariaLabel,
  className,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  perView?: [number, number, number];
  interval?: number;
  gap?: number;
  ariaLabel?: string;
  className?: string;
}) {
  const pv = usePerView(perView);
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(true);

  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += pv) pages.push(items.slice(i, i + pv));
  const n = pages.length;

  useEffect(() => {
    if (page >= n) setPage(0);
  }, [n, page]);

  useEffect(() => {
    if (!playing || n <= 1) return;
    const id = setInterval(() => setPage((p) => (p + 1) % n), interval);
    return () => clearInterval(id);
  }, [playing, n, interval]);

  if (items.length === 0) return null;
  const go = (d: number) => setPage((p) => (p + d + n) % n);
  const current = Math.min(page, n - 1);

  return (
    <div className={cn("relative", className)} role="group" aria-label={ariaLabel}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {pages.map((group, gi) => (
            <div
              key={gi}
              className="grid w-full shrink-0"
              style={{ gridTemplateColumns: `repeat(${pv}, minmax(0, 1fr))`, gap }}
              aria-hidden={gi !== current}
            >
              {group.map((it, ii) => renderItem(it, gi * pv + ii))}
            </div>
          ))}
        </div>
      </div>

      {n > 1 && (
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
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === current
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
      )}
    </div>
  );
}
