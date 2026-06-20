-- ============================================================================
-- MANUAL SETUP — run this once in the Supabase SQL Editor (Lovable Cloud).
-- It is idempotent: safe to run more than once, and it never overwrites
-- content you already have. It bundles both migrations:
--   * Team/admin allow-list + RPCs + signup auto-grant
--   * Full Stack as primary niche + seed (projects, certs, brands, story)
--   * Email Marketer seed (tools, certs, brands, story, testimonials)
--   * Owner account ogbeifundaniel0@gmail.com as ADMIN
-- ============================================================================

-- ─────────────────────────────────────────────────────────────
-- 1) ADMIN ALLOW-LIST + AUTO-GRANT ON SIGNUP
-- ─────────────────────────────────────────────────────────────
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

INSERT INTO public.admin_emails (email) VALUES ('ogbeifundaniel0@gmail.com')
ON CONFLICT (email) DO NOTHING;

CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE lower(email) = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role) ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.grant_owner_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_owner ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_owner
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

-- ─────────────────────────────────────────────────────────────
-- 2) ADMIN RPCs (used by the Team / Users panel)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (user_id uuid, email text, is_admin boolean, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
    SELECT u.id, u.email::text,
           EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin'),
           u.created_at
    FROM auth.users u ORDER BY u.created_at;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_set_admin(target_email text, make_admin boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid; norm text := lower(trim(target_email));
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Not authorized'; END IF;
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
END; $$;

REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_admin(text, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_admin(text, boolean) TO authenticated;

-- ─────────────────────────────────────────────────────────────
-- 3) MAKE THE OWNER AN ADMIN  ⭐  (the part you asked about)
--    Works whether or not the account already exists.
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DO $$
DECLARE new_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = 'ogbeifundaniel0@gmail.com') THEN
    -- create the account with a confirmed email + password
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', new_id, 'authenticated', 'authenticated',
      'ogbeifundaniel0@gmail.com',
      extensions.crypt('Ogbeifun@2005', extensions.gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      '', '', '', ''
    );
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), new_id,
      json_build_object('sub', new_id::text, 'email', 'ogbeifundaniel0@gmail.com')::jsonb,
      'email', new_id::text, now(), now(), now()
    );
    INSERT INTO public.user_roles (user_id, role) VALUES (new_id, 'admin'::app_role)
      ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- account already exists → just grant admin
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'ogbeifundaniel0@gmail.com'
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'owner account step skipped: %', SQLERRM;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 4) FULL STACK = PRIMARY NICHE
-- ─────────────────────────────────────────────────────────────
UPDATE public.niches SET sort_order = 1 WHERE slug = 'fullstack-developer';

-- ─────────────────────────────────────────────────────────────
-- 5) FULL STACK SEED (projects w/ live screenshots, certs, brands, story)
-- ─────────────────────────────────────────────────────────────
WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(brand_name, category, platform, description, external_link, sort_order) AS (
  VALUES
    ('Allied Property Compass','Real Estate Platform','Web App','A property discovery and management platform.','https://allied-property-compass.lovable.app',10),
    ('Golden Coast Gather','Events & Community','Web App','An events and community gathering experience.','https://golden-coast-gather.lovable.app',11),
    ('Serene Path','Wellness & Lifestyle','Web App','A calming wellness redesign focused on flow.','https://serene-path-redesign.lovable.app',12),
    ('RIE Pathfinder','SaaS / Productivity','Web App','A guided pathfinder tool for reaching goals.','https://rie-pathfinder.lovable.app',13),
    ('Motion Health','Health Tech','Web App','A modern health product launch experience.','https://motion-health-launch.lovable.app',14)
)
INSERT INTO public.projects (niche_id, brand_name, category, platform, description, external_link, media_type, is_starred, sort_order)
SELECT n.id, d.brand_name, d.category, d.platform, d.description, d.external_link, 'image', true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.projects p WHERE p.niche_id = n.id
  AND (p.external_link = d.external_link OR lower(p.brand_name) = lower(d.brand_name)));

WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(name, issuer, date_earned, sort_order) AS (
  VALUES
    ('Meta Front-End Developer','Meta (Coursera)',DATE '2023-04-01',1),
    ('Meta Back-End Developer','Meta (Coursera)',DATE '2023-09-01',2),
    ('Full Stack Web Development','freeCodeCamp',DATE '2022-07-01',3),
    ('JavaScript Algorithms & Data Structures','freeCodeCamp',DATE '2022-02-01',4),
    ('Responsive Web Design','freeCodeCamp',DATE '2021-11-01',5),
    ('React — The Complete Guide','Udemy',DATE '2023-01-01',6),
    ('The Complete Web Developer Bootcamp','Udemy',DATE '2021-08-01',7),
    ('Google UX Design','Google (Coursera)',DATE '2023-06-01',8),
    ('Supabase & PostgreSQL Fundamentals','Supabase',DATE '2024-03-01',9),
    ('TypeScript Deep Dive','Frontend Masters',DATE '2024-01-01',10)
)
INSERT INTO public.certifications (niche_id, name, issuer, date_earned, sort_order)
SELECT n.id, d.name, d.issuer, d.date_earned, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.certifications c WHERE c.niche_id = n.id AND lower(c.name) = lower(d.name));

WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(alt_text, sort_order) AS (
  VALUES ('Allied Property Compass',1),('Golden Coast Gather',2),('Serene Path',3),
    ('RIE Pathfinder',4),('Motion Health',5),('Xanctum',6),('Xpers Streaming',7),
    ('Blade & Beard',8),('Luxe Estate',9)
)
INSERT INTO public.brand_logos (niche_id, logo_url, alt_text, bg_color, is_starred, sort_order)
SELECT n.id, '', d.alt_text, '#FFFFFF', true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.brand_logos b WHERE b.niche_id = n.id AND lower(b.alt_text) = lower(d.alt_text));

INSERT INTO public.niche_stories (niche_id, story_text, quote)
SELECT n.id,
$s$My story doesn't start with a computer science degree — it starts with curiosity and a refusal to accept "that's just how it works."

I taught myself to build by breaking things, then rebuilding them better and faster. That's the "vibe coder" in me — I build in a flow state, treating every project like a craft. Over the years that became a real skill set: full-stack web apps, real-time platforms, e-commerce and dashboards — idea to deploy.

What drives me now is the same thing that started it all: taking a half-formed idea and turning it into something real, polished, and live on the internet.$s$,
  'Build like it''s yours. Ship like it matters.'
FROM public.niches n
WHERE n.slug = 'fullstack-developer'
  AND NOT EXISTS (SELECT 1 FROM public.niche_stories s WHERE s.niche_id = n.id);

-- Full Stack testimonials (sample — edit in admin)
WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(client_name, role, review_text, rating, sort_order) AS (
  VALUES
    ('Sarah Mitchell','Founder, Allied Property Compass','Daniel took our idea and shipped a polished, fast platform in record time.',5,1),
    ('Daniel Roberts','Product Lead, Motion Health','Pixel-perfect, lightning fast, and he sweats the details nobody else does.',5,2),
    ('Grace Adeyemi','CEO, Luxe Estate','He vibe-codes at a speed that is hard to believe — without cutting corners.',5,3),
    ('Michael Osei','Founder, Xpers','From database to deploy, he handled everything. Clean code, beautiful UI.',5,4)
)
INSERT INTO public.testimonials (niche_id, client_name, role, review_text, rating, is_starred, sort_order)
SELECT n.id, d.client_name, d.role, d.review_text, d.rating, true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials t WHERE t.niche_id = n.id AND lower(t.client_name) = lower(d.client_name));

-- ─────────────────────────────────────────────────────────────
-- 6) EMAIL MARKETER SEED (tools, certs, brands, story, testimonials)
-- ─────────────────────────────────────────────────────────────
WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(name, percentage, sort_order) AS (
  VALUES ('Klaviyo',95,1),('Mailchimp',92,2),('HubSpot',90,3),('ActiveCampaign',88,4),
    ('ConvertKit',85,5),('Brevo',84,6),('Marketo',80,7),('Salesforce Marketing Cloud',78,8),
    ('Litmus',86,9),('MJML',88,10),('HTML & CSS Email',92,11),('Figma',85,12),
    ('Canva',88,13),('Zapier',82,14),('Google Analytics',84,15),('A/B Testing',90,16),
    ('Segmentation',92,17),('Automation Flows',93,18),('Deliverability',88,19),('Copywriting',90,20)
)
INSERT INTO public.skills (niche_id, name, percentage, sort_order)
SELECT n.id, d.name, d.percentage, d.sort_order FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.skills s WHERE s.niche_id = n.id AND lower(s.name) = lower(d.name));

WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(name, issuer, date_earned, sort_order) AS (
  VALUES ('Email Marketing Certification','HubSpot Academy',DATE '2023-03-01',1),
    ('Klaviyo Product Certification','Klaviyo',DATE '2023-07-01',2),
    ('Mailchimp Foundations','Mailchimp Academy',DATE '2022-09-01',3),
    ('Inbound Marketing Certification','HubSpot Academy',DATE '2022-11-01',4),
    ('Google Analytics Certification','Google',DATE '2023-05-01',5),
    ('Digital Marketing Associate','Meta',DATE '2023-02-01',6),
    ('Email Marketing Mastery','Udemy',DATE '2022-06-01',7),
    ('Copywriting for Conversions','Copyhackers',DATE '2023-09-01',8),
    ('Marketing Analytics','Coursera',DATE '2024-01-01',9),
    ('Lifecycle & Retention Marketing','CXL',DATE '2024-03-01',10)
)
INSERT INTO public.certifications (niche_id, name, issuer, date_earned, sort_order)
SELECT n.id, d.name, d.issuer, d.date_earned, d.sort_order FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.certifications c WHERE c.niche_id = n.id AND lower(c.name) = lower(d.name));

WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(alt_text, sort_order) AS (
  VALUES ('Allied Property',1),('Golden Coast',2),('Serene Path',3),('Motion Health',4),
    ('Luxe Estate',5),('Blade & Beard',6),('Xpers',7),('Xanctum',8)
)
INSERT INTO public.brand_logos (niche_id, logo_url, alt_text, bg_color, is_starred, sort_order)
SELECT n.id, '', d.alt_text, '#FFFFFF', true, d.sort_order FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.brand_logos b WHERE b.niche_id = n.id AND lower(b.alt_text) = lower(d.alt_text));

INSERT INTO public.niche_stories (niche_id, story_text, quote)
SELECT n.id,
$s$I fell into email marketing because I loved the idea of a single message landing in someone's inbox and actually moving them to act.

What started as curiosity about subject lines grew into a craft: lifecycle flows, segmentation, designs that look great in every client, and obsessing over deliverability so the work gets seen.

Today I help brands turn their email list into one of their most profitable channels — welcome flows, promos, win-backs and everything in between.$s$,
  'The inbox is the most personal channel you own — treat it that way.'
FROM public.niches n
WHERE n.slug = 'email-marketer'
  AND NOT EXISTS (SELECT 1 FROM public.niche_stories s WHERE s.niche_id = n.id);

WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(client_name, role, review_text, rating, sort_order) AS (
  VALUES
    ('Sarah Mitchell','Founder, Luxe Estate','Our email revenue nearly doubled in two months. The flows run on autopilot.',5,1),
    ('David Chen','Marketing Lead, Motion Health','Deliverability was killing us. He cleaned it up and open rates jumped overnight.',5,2),
    ('Amara Okeke','CEO, Blade & Beard','Beautiful, on-brand emails and copy that actually converts.',5,3),
    ('Tomiwa Adeyemi','Growth, Xpers','He treats your list like a real asset. Segmentation was a game changer.',5,4)
)
INSERT INTO public.testimonials (niche_id, client_name, role, review_text, rating, is_starred, sort_order)
SELECT n.id, d.client_name, d.role, d.review_text, d.rating, true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (SELECT 1 FROM public.testimonials t WHERE t.niche_id = n.id AND lower(t.client_name) = lower(d.client_name));

-- ✅ Done. Sign in at /admin with ogbeifundaniel0@gmail.com / Ogbeifun@2005
