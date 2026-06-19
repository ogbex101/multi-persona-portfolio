import type { NicheBundle } from "@/lib/niche-queries";
import { SectionShell } from "./SectionShell";
import { Marquee } from "./Marquee";
import { Award, ExternalLink } from "lucide-react";

export function Certifications({
  bundle,
  showAll = false,
}: {
  bundle: NicheBundle;
  showAll?: boolean;
}) {
  const list = bundle.certifications;
  if (list.length === 0) return null;

  return (
    <SectionShell
      id="certifications"
      eyebrow="Credentials"
      title="Certifications & training."
      description="Continuous learning across the full stack — gliding by below."
      viewAllTo={!showAll ? "/niche/$slug/certifications" : undefined}
      viewAllParams={!showAll ? { slug: bundle.niche.slug } : undefined}
    >
      {showAll ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c: any) => (
            <CertCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <Marquee
          items={list}
          ariaLabel="Certifications"
          direction="left"
          speed={28}
          itemClassName="w-[320px]"
          renderItem={(c: any) => <CertCard c={c} />}
        />
      )}
    </SectionShell>
  );
}

function CertCard({ c }: { c: any }) {
  return (
    <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
        {c.badge_url ? (
          <img src={c.badge_url} alt={c.name} className="h-full w-full rounded-xl object-cover" />
        ) : (
          <Award className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-tight">{c.name}</h3>
        {c.issuer && <p className="text-sm text-muted-foreground">{c.issuer}</p>}
        {c.date_earned && (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(c.date_earned).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
            })}
          </p>
        )}
        {c.credential_link && (
          <a
            href={c.credential_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--brand-primary-hex)] hover:underline"
          >
            Verify <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
