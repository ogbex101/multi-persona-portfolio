import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { nicheBundleQuery } from "@/lib/niche-queries";
import { EmailDesigns } from "@/components/portfolio/EmailDesigns";

export const Route = createFileRoute("/niche/$slug/email-designs")({
  component: AllEmail,
});

function AllEmail() {
  const { slug } = Route.useParams();
  const { data: bundle } = useQuery(nicheBundleQuery(slug));
  if (!bundle) return null;
  return <div className="pt-10"><EmailDesigns bundle={bundle} showAll /></div>;
}
