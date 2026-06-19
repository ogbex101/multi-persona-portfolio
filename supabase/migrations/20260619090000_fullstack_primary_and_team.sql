-- ============================================================
-- Full Stack / Vibe Coder as the primary niche, Team management,
-- and idempotent content enrichment. Safe to re-run.
-- ============================================================

-- 1. Make Full Stack Developer the primary (first) niche.
UPDATE public.niches SET sort_order = 1 WHERE slug = 'fullstack-developer';

-- ============================================================
-- 2. Admin allow-list + generalized auto-grant on signup
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins read admin_emails" ON public.admin_emails;
CREATE POLICY "admins read admin_emails" ON public.admin_emails
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins manage admin_emails" ON public.admin_emails;
CREATE POLICY "admins manage admin_emails" ON public.admin_emails
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the owner into the allow-list.
INSERT INTO public.admin_emails (email) VALUES ('ogbeifundaniel0@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Auto-grant admin on signup for any email in the allow-list.
CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE lower(email) = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.grant_owner_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_owner ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_owner
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

-- ============================================================
-- 3. Admin RPCs for the Team / Users panel
-- ============================================================
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (user_id uuid, email text, is_admin boolean, created_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY
    SELECT u.id,
           u.email::text,
           EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin'),
           u.created_at
    FROM auth.users u
    ORDER BY u.created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_admin(target_email text, make_admin boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  norm text := lower(trim(target_email));
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF norm = 'ogbeifundaniel0@gmail.com' AND make_admin = false THEN
    RAISE EXCEPTION 'Cannot remove the owner admin';
  END IF;

  IF make_admin THEN
    INSERT INTO public.admin_emails (email) VALUES (norm) ON CONFLICT (email) DO NOTHING;
  ELSE
    DELETE FROM public.admin_emails WHERE lower(email) = norm;
  END IF;

  SELECT id INTO uid FROM auth.users WHERE lower(email) = norm LIMIT 1;
  IF uid IS NOT NULL THEN
    IF make_admin THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin'::app_role)
      ON CONFLICT (user_id, role) DO NOTHING;
    ELSE
      DELETE FROM public.user_roles WHERE user_id = uid AND role = 'admin';
    END IF;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_admin(text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_admin(text, boolean) TO authenticated;

-- ============================================================
-- 4. Starter "My Story" (only if none exists / empty)
-- ============================================================
INSERT INTO public.niche_stories (niche_id, story_text, quote)
SELECT n.id,
$story$My story doesn't start with a computer science degree — it starts with curiosity and a stubborn refusal to accept "that's just how it works."

I taught myself to build by breaking things, then rebuilding them better, faster and cleaner. Somewhere in those late nights, coding stopped feeling like work and started feeling like play. That's the "vibe coder" in me — I build in a flow state, fast and intentional, treating every project like a craft.

Over the years that turned into a real skill set: full-stack web apps, real-time platforms, e-commerce and dashboards — idea to deploy. What drives me now is the same thing that started it all: taking a half-formed idea and turning it into something real, polished, and live on the internet.$story$,
  'Build like it''s yours. Ship like it matters.'
FROM public.niches n
WHERE n.slug = 'fullstack-developer'
  AND NOT EXISTS (SELECT 1 FROM public.niche_stories s WHERE s.niche_id = n.id);

UPDATE public.niche_stories s
SET story_text = $story$My story doesn't start with a computer science degree — it starts with curiosity and a stubborn refusal to accept "that's just how it works."

I taught myself to build by breaking things, then rebuilding them better, faster and cleaner. Somewhere in those late nights, coding stopped feeling like work and started feeling like play. That's the "vibe coder" in me — I build in a flow state, fast and intentional, treating every project like a craft.

Over the years that turned into a real skill set: full-stack web apps, real-time platforms, e-commerce and dashboards — idea to deploy. What drives me now is the same thing that started it all: taking a half-formed idea and turning it into something real, polished, and live on the internet.$story$
FROM public.niches n
WHERE s.niche_id = n.id AND n.slug = 'fullstack-developer'
  AND (s.story_text IS NULL OR btrim(s.story_text) = '');

-- ============================================================
-- 5. Sample projects (live Lovable builds). media_url is left NULL so the
--    site auto-captures a live screenshot from external_link. Skips any that
--    already exist (matched by link or brand name).
-- ============================================================
WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(brand_name, category, platform, description, external_link, sort_order) AS (
  VALUES
    ('Allied Property Compass', 'Real Estate Platform', 'Web App', 'A property discovery and management platform that helps buyers navigate listings with ease.', 'https://allied-property-compass.lovable.app', 10),
    ('Golden Coast Gather', 'Events & Community', 'Web App', 'An events and community gathering experience with a warm, coastal aesthetic.', 'https://golden-coast-gather.lovable.app', 11),
    ('Serene Path', 'Wellness & Lifestyle', 'Web App', 'A calming wellness redesign focused on clarity, flow and a serene user journey.', 'https://serene-path-redesign.lovable.app', 12),
    ('RIE Pathfinder', 'SaaS / Productivity', 'Web App', 'A guided pathfinder tool that helps users chart the right route to their goals.', 'https://rie-pathfinder.lovable.app', 13),
    ('Motion Health', 'Health Tech', 'Web App', 'A modern health product launch experience with motion-rich storytelling.', 'https://motion-health-launch.lovable.app', 14)
)
INSERT INTO public.projects (niche_id, brand_name, category, platform, description, external_link, media_type, is_starred, sort_order)
SELECT n.id, d.brand_name, d.category, d.platform, d.description, d.external_link, 'image', true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects p
  WHERE p.niche_id = n.id
    AND (p.external_link = d.external_link OR lower(p.brand_name) = lower(d.brand_name))
);

-- ============================================================
-- 6. Certifications & training (idempotent by name)
-- ============================================================
WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(name, issuer, date_earned, sort_order) AS (
  VALUES
    ('Meta Front-End Developer', 'Meta (Coursera)', DATE '2023-04-01', 1),
    ('Meta Back-End Developer', 'Meta (Coursera)', DATE '2023-09-01', 2),
    ('Full Stack Web Development', 'freeCodeCamp', DATE '2022-07-01', 3),
    ('JavaScript Algorithms & Data Structures', 'freeCodeCamp', DATE '2022-02-01', 4),
    ('Responsive Web Design', 'freeCodeCamp', DATE '2021-11-01', 5),
    ('React — The Complete Guide', 'Udemy', DATE '2023-01-01', 6),
    ('The Complete Web Developer Bootcamp', 'Udemy', DATE '2021-08-01', 7),
    ('Google UX Design', 'Google (Coursera)', DATE '2023-06-01', 8),
    ('Supabase & PostgreSQL Fundamentals', 'Supabase', DATE '2024-03-01', 9),
    ('TypeScript Deep Dive', 'Frontend Masters', DATE '2024-01-01', 10)
)
INSERT INTO public.certifications (niche_id, name, issuer, date_earned, sort_order)
SELECT n.id, d.name, d.issuer, d.date_earned, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.certifications c
  WHERE c.niche_id = n.id AND lower(c.name) = lower(d.name)
);

-- ============================================================
-- 7. Brands worked with (text logos; idempotent by alt_text)
-- ============================================================
WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(alt_text, sort_order) AS (
  VALUES
    ('Allied Property Compass', 1),
    ('Golden Coast Gather', 2),
    ('Serene Path', 3),
    ('RIE Pathfinder', 4),
    ('Motion Health', 5),
    ('Xanctum', 6),
    ('Xpers Streaming', 7),
    ('Blade & Beard', 8),
    ('Luxe Estate', 9)
)
INSERT INTO public.brand_logos (niche_id, logo_url, alt_text, bg_color, is_starred, sort_order)
SELECT n.id, '', d.alt_text, '#FFFFFF', true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.brand_logos b
  WHERE b.niche_id = n.id AND lower(b.alt_text) = lower(d.alt_text)
);
