import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { nicheBundleQuery } from "@/lib/niche-queries";
import { Projects } from "@/components/portfolio/Projects";

export const Route = createFileRoute("/niche/$slug/projects")({
  component: AllProjects,
});

function AllProjects() {
  const { slug } = Route.useParams();
  const { data: bundle } = useQuery(nicheBundleQuery(slug));
  if (!bundle) return null;
  return <div className="pt-10"><Projects bundle={bundle} showAll /></div>;
}
