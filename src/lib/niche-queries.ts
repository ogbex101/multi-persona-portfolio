import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Niche = {
  id: string;
  slug: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
};

export const allNichesQuery = () =>
  queryOptions({
    queryKey: ["niches"],
    queryFn: async (): Promise<Niche[]> => {
      const { data, error } = await supabase
        .from("niches")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Niche[];
    },
    staleTime: 60_000,
  });

export const nicheBundleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["niche-bundle", slug],
    queryFn: async () => {
      const { data: niche, error: nErr } = await supabase
        .from("niches")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (nErr) throw nErr;
      if (!niche) return null;

      const nicheId = niche.id;
      const [
        settings,
        story,
        services,
        skills,
        projects,
        certifications,
        testimonials,
        brandLogos,
        socialLinks,
        limits,
        emailDesigns,
      ] = await Promise.all([
        supabase.from("niche_settings").select("*").eq("niche_id", nicheId).maybeSingle(),
        supabase.from("niche_stories").select("*").eq("niche_id", nicheId).maybeSingle(),
        supabase.from("services").select("*").eq("niche_id", nicheId).order("sort_order"),
        supabase.from("skills").select("*").eq("niche_id", nicheId).order("sort_order"),
        supabase.from("projects").select("*").eq("niche_id", nicheId).order("sort_order"),
        supabase.from("certifications").select("*").eq("niche_id", nicheId).order("sort_order"),
        supabase.from("testimonials").select("*").eq("niche_id", nicheId).order("sort_order"),
        supabase.from("brand_logos").select("*").eq("niche_id", nicheId).order("sort_order"),
        supabase.from("social_links").select("*").eq("niche_id", nicheId).order("sort_order"),
        supabase.from("niche_homepage_limits").select("*").eq("niche_id", nicheId),
        slug === "email-marketer"
          ? supabase.from("email_designs").select("*").eq("niche_id", nicheId).order("sort_order")
          : Promise.resolve({ data: [], error: null }),
      ]);

      const limitsMap: Record<string, number> = {};
      (limits.data ?? []).forEach((l: any) => { limitsMap[l.section_name] = l.max_display; });

      return {
        niche,
        settings: settings.data,
        story: story.data,
        services: services.data ?? [],
        skills: skills.data ?? [],
        projects: projects.data ?? [],
        certifications: certifications.data ?? [],
        testimonials: testimonials.data ?? [],
        brandLogos: brandLogos.data ?? [],
        socialLinks: socialLinks.data ?? [],
        emailDesigns: emailDesigns.data ?? [],
        limits: limitsMap,
      };
    },
    staleTime: 30_000,
  });

type NicheBundleFn = NonNullable<ReturnType<typeof nicheBundleQuery>["queryFn"]>;
export type NicheBundle = NonNullable<Awaited<ReturnType<NicheBundleFn>>>;
