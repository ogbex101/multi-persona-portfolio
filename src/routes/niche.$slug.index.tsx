import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { nicheBundleQuery } from "@/lib/niche-queries";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Story } from "@/components/portfolio/Story";
import { Services } from "@/components/portfolio/Services";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Certifications } from "@/components/portfolio/Certifications";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { BrandLogos } from "@/components/portfolio/BrandLogos";
import { EmailDesigns } from "@/components/portfolio/EmailDesigns";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/niche/$slug/")({
  component: NicheHome,
});

function NicheHome() {
  const { slug } = Route.useParams();
  const { data: bundle, isLoading } = useQuery(nicheBundleQuery(slug));

  if (isLoading || !bundle) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="h-12 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="mt-4 h-6 w-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <>
      <Hero bundle={bundle} />
      <About bundle={bundle} />
      <Story bundle={bundle} />
      <Services bundle={bundle} />
      <Skills bundle={bundle} />
      <Projects bundle={bundle} />
      <EmailDesigns bundle={bundle} />
      <Certifications bundle={bundle} />
      <Testimonials bundle={bundle} />
      <BrandLogos bundle={bundle} />
      <Contact bundle={bundle} />
    </>
  );
}
