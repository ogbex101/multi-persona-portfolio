import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { nicheBundleQuery } from "@/lib/niche-queries";
import { Testimonials } from "@/components/portfolio/Testimonials";

export const Route = createFileRoute("/niche/$slug/testimonials")({
  component: AllTestimonials,
});

function AllTestimonials() {
  const { slug } = Route.useParams();
  const { data: bundle } = useQuery(nicheBundleQuery(slug));
  if (!bundle) return null;
  return <div className="pt-10"><Testimonials bundle={bundle} showAll /></div>;
}
