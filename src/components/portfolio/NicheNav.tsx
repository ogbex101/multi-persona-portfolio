import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { allNichesQuery } from "@/lib/niche-queries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NicheNav() {
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const navigate = useNavigate();
  const { data: niches = [] } = useQuery(allNichesQuery());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = niches.find((n) => n.slug === slug);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-smooth",
        scrolled ? "glass border-b border-border/40 shadow-soft" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/niche/$slug"
          params={{ slug: slug ?? "email-marketer" }}
          className="flex items-center gap-2 font-display text-base font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Ogbeifun Daniel</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {niches.map((n) => (
            <button
              key={n.id}
              onClick={() => navigate({ to: "/niche/$slug", params: { slug: n.slug } })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-smooth",
                n.slug === slug
                  ? "bg-gradient-brand text-primary-foreground shadow-elegant"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {n.display_name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <a href="#contact">Hire Me</a>
          </Button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {niches.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setMobileOpen(false);
                  navigate({ to: "/niche/$slug", params: { slug: n.slug } });
                }}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm font-medium transition-smooth",
                  n.slug === slug ? "bg-gradient-brand text-primary-foreground" : "hover:bg-muted"
                )}
              >
                {n.display_name}
              </button>
            ))}
            {active && (
              <Button asChild className="mt-2"><a href="#contact" onClick={() => setMobileOpen(false)}>Hire Me</a></Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
