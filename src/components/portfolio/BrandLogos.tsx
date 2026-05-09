import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";

export function BrandLogos({ bundle }: { bundle: NicheBundle }) {
  const limit = bundle.limits.brand_logos ?? 8;
  const starred = bundle.brandLogos.filter((b: any) => b.is_starred);
  const list = (starred.length ? starred : bundle.brandLogos).slice(0, limit);
  if (list.length === 0) return null;
  return (
    <SectionShell id="brands" eyebrow="Trusted by" title="Brands I've worked with.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {list.map((b: any) => (
          <div
            key={b.id}
            className="grid aspect-[3/2] place-items-center overflow-hidden rounded-2xl border border-border p-6 shadow-soft transition-smooth hover:shadow-elegant"
            style={{ backgroundColor: b.bg_color ?? "#FFFFFF" }}
          >
            {b.logo_url ? (
              <img src={b.logo_url} alt={b.alt_text ?? "Brand"} className="max-h-16 w-auto object-contain" loading="lazy" />
            ) : (
              <span className="font-display font-bold">{b.alt_text}</span>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
