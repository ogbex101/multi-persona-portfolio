
-- 1. Add hero background image column
ALTER TABLE public.niche_settings ADD COLUMN IF NOT EXISTS hero_background_url text;

-- 2. Grant admin to existing owner user (one-time bootstrap)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'ogbeifundaniel0@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Trigger: auto-grant admin role to the owner email on future signups
CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'ogbeifundaniel0@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_owner ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_owner
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

-- 4. Seed default hero background URLs per niche (only if not set)
UPDATE public.niche_settings ns SET hero_background_url = sub.url
FROM (
  SELECT n.id, CASE n.slug
    WHEN 'email-marketer' THEN 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=1920&q=80'
    WHEN 'forex-bot-creator' THEN 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80'
    WHEN 'web3-developer' THEN 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80'
    WHEN 'ai-video-editor' THEN 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1920&q=80'
  END AS url FROM public.niches n
) sub
WHERE ns.niche_id = sub.id AND (ns.hero_background_url IS NULL OR ns.hero_background_url = '');

-- 5. Add Full Stack Developer / Vibe Coder niche
INSERT INTO public.niches (slug, display_name, sort_order, is_active)
VALUES ('fullstack-developer', 'Full Stack Developer / Vibe Coder', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 6. Default settings + limits for the new niche
INSERT INTO public.niche_settings (niche_id, full_name, title, hero_tagline, bio, email,
  primary_color, secondary_color, accent_color, projects_count, happy_clients, years_experience,
  hero_background_url)
SELECT n.id, 'Ogbeifun Daniel Osewe', 'Full Stack Developer / Vibe Coder',
  'Shipping production apps with style and speed.',
  'I build end-to-end web applications with a strong sense of design, performance, and developer experience. From idea to deploy — I vibe-code it into reality.',
  'ogbeifundaniel0@gmail.com',
  '#10B981', '#0F172A', '#F472B6', 25, 18, 4,
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80'
FROM public.niches n
WHERE n.slug = 'fullstack-developer'
  AND NOT EXISTS (SELECT 1 FROM public.niche_settings WHERE niche_id = n.id);

INSERT INTO public.niche_homepage_limits (niche_id, section_name, max_display)
SELECT n.id, s.section_name, s.max_display
FROM public.niches n
CROSS JOIN (VALUES ('services',6),('projects',6),('testimonials',6),('brand_logos',8)) AS s(section_name, max_display)
WHERE n.slug = 'fullstack-developer'
  AND NOT EXISTS (SELECT 1 FROM public.niche_homepage_limits WHERE niche_id = n.id AND section_name = s.section_name);
