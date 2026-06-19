import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Marquee } from "./Marquee";

export function BrandLogos({ bundle }: { bundle: NicheBundle }) {
  const starred = bundle.brandLogos.filter((b: any) => b.is_starred);
  const list = starred.length ? starred : bundle.brandLogos;
  if (list.length === 0) return null;

  return (
    <SectionShell id="brands" eyebrow="Trusted by" title="Brands I've worked with.">
      <Marquee
        items={list}
        ariaLabel="Brand logos"
        direction="right"
        speed={24}
        itemClassName="w-[180px]"
        renderItem={(b: any) => (
          <div
            className="grid aspect-[3/2] w-[180px] place-items-center overflow-hidden rounded-2xl border border-border p-6 shadow-soft transition-smooth hover:shadow-elegant"
            style={{ backgroundColor: b.bg_color ?? "#FFFFFF" }}
          >
            {b.logo_url ? (
              <img
                src={b.logo_url}
                alt={b.alt_text ?? "Brand"}
                className="max-h-14 w-auto object-contain"
                loading="lazy"
              />
            ) : (
              <span className="font-display font-bold text-slate-800">{b.alt_text}</span>
            )}
          </div>
        )}
      />
    </SectionShell>
  );
}
