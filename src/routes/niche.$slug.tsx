import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { nicheBundleQuery } from "@/lib/niche-queries";
import { NicheNav } from "@/components/portfolio/NicheNav";
import { Footer } from "@/components/portfolio/Footer";
import { NicheThemeProvider } from "@/components/portfolio/ThemeProvider";

export const Route = createFileRoute("/niche/$slug")({
  loader: ({ params, context }) => {
    return context.queryClient.ensureQueryData(nicheBundleQuery(params.slug));
  },
  head: ({ loaderData }) => {
    const s = loaderData?.settings;
    const title = s?.title
      ? `${s.full_name ?? "Ogbeifun Daniel"} — ${s.title}`
      : "Ogbeifun Daniel Osewe";
    const description = s?.bio?.slice(0, 155) ?? "Multi-niche portfolio of Ogbeifun Daniel Osewe.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: NicheLayout,
});

function NicheLayout() {
  const { slug } = Route.useParams();
  const { data: bundle } = useQuery({ ...nicheBundleQuery(slug) });

  if (bundle === null) throw notFound();

  return (
    <NicheThemeProvider theme={bundle?.settings ?? undefined}>
      <div className="page-enter min-h-screen bg-background">
        <NicheNav />
        <main key={slug}>
          <Outlet />
        </main>
        {bundle && <Footer bundle={bundle} />}
      </div>
    </NicheThemeProvider>
  );
}
