import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  viewAllTo,
  viewAllParams,
  alt = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  viewAllTo?: string;
  viewAllParams?: Record<string, string>;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-24",
        alt ? "bg-surface" : "bg-background",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {eyebrow && (
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-accent-hex)]">
                {eyebrow}
              </div>
            )}
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
            {description && <p className="mt-3 text-muted-foreground text-balance">{description}</p>}
          </div>
          {viewAllTo && viewAllParams && (
            <Link
              to={viewAllTo as any}
              params={viewAllParams as any}
              className="group inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand-primary-hex)] hover:underline"
            >
              View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
