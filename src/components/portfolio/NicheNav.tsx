import { Link, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRIMARY_SLUG = "fullstack-developer";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "story", label: "My Story" },
  { id: "services", label: "Services" },
  { id: "tools", label: "Tools" },
  { id: "projects", label: "Work" },
  { id: "testimonials", label: "Praise" },
  { id: "contact", label: "Contact" },
];

export function NicheNav() {
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const current = slug ?? PRIMARY_SLUG;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hashHref = (id: string) => `/niche/${current}#${id}`;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-smooth",
        scrolled ? "glass border-b border-border/40 shadow-soft" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/niche/$slug"
          params={{ slug: current }}
          className="flex items-center gap-2 font-display text-base font-bold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Ogbeifun Daniel</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((sec) => (
            <a
              key={sec.id}
              href={hashHref(sec.id)}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
            >
              {sec.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="hidden sm:inline-flex">
            <a href={hashHref("contact")}>Hire Me</a>
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
            {SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={hashHref(sec.id)}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium transition-smooth hover:bg-muted"
              >
                {sec.label}
              </a>
            ))}
            <Button asChild className="mt-2">
              <a href={hashHref("contact")} onClick={() => setMobileOpen(false)}>
                Hire Me
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
