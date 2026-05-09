import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { nicheBundleQuery } from "@/lib/niche-queries";
import { Certifications } from "@/components/portfolio/Certifications";

export const Route = createFileRoute("/niche/$slug/certifications")({
  component: AllCerts,
});

function AllCerts() {
  const { slug } = Route.useParams();
  const { data: bundle } = useQuery(nicheBundleQuery(slug));
  if (!bundle) return null;
  return <div className="pt-10"><Certifications bundle={bundle} showAll /></div>;
}
