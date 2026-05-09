import type { NicheBundle } from "@/lib/niche-queries";
import * as Icons from "lucide-react";

export function Footer({ bundle }: { bundle: NicheBundle }) {
  const s = bundle.settings;
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
        <div>
          <div className="font-display text-lg font-bold">{s?.full_name ?? "Ogbeifun Daniel Osewe"}</div>
          <div className="text-sm text-muted-foreground">{s?.title}</div>
        </div>

        <div className="flex items-center gap-2">
          {bundle.socialLinks.map((sl: any) => {
            const Icon = (Icons[sl.icon as keyof typeof Icons] as any) ?? Icons.Link;
            return (
              <a
                key={sl.id}
                href={sl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-gradient-brand hover:text-primary-foreground hover:shadow-elegant"
                aria-label={sl.platform}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {s?.full_name ?? "Daniel Osewe"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
