-- ============================================================
-- Populate the Email Marketer niche so it has the same rich sections as
-- Full Stack, seed testimonials for both, and best-effort provision the
-- owner account. Fully idempotent / safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- Email Marketer: tools / skills
-- ------------------------------------------------------------
WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(name, percentage, sort_order) AS (
  VALUES
    ('Klaviyo', 95, 1), ('Mailchimp', 92, 2), ('HubSpot', 90, 3),
    ('ActiveCampaign', 88, 4), ('ConvertKit', 85, 5), ('Brevo', 84, 6),
    ('Marketo', 80, 7), ('Salesforce Marketing Cloud', 78, 8),
    ('Litmus', 86, 9), ('MJML', 88, 10), ('HTML & CSS Email', 92, 11),
    ('Figma', 85, 12), ('Canva', 88, 13), ('Zapier', 82, 14),
    ('Google Analytics', 84, 15), ('A/B Testing', 90, 16),
    ('Segmentation', 92, 17), ('Automation Flows', 93, 18),
    ('Deliverability', 88, 19), ('Copywriting', 90, 20)
)
INSERT INTO public.skills (niche_id, name, percentage, sort_order)
SELECT n.id, d.name, d.percentage, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.skills s WHERE s.niche_id = n.id AND lower(s.name) = lower(d.name)
);

-- ------------------------------------------------------------
-- Email Marketer: certifications
-- ------------------------------------------------------------
WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(name, issuer, date_earned, sort_order) AS (
  VALUES
    ('Email Marketing Certification', 'HubSpot Academy', DATE '2023-03-01', 1),
    ('Klaviyo Product Certification', 'Klaviyo', DATE '2023-07-01', 2),
    ('Mailchimp Foundations', 'Mailchimp Academy', DATE '2022-09-01', 3),
    ('Inbound Marketing Certification', 'HubSpot Academy', DATE '2022-11-01', 4),
    ('Google Analytics Certification', 'Google', DATE '2023-05-01', 5),
    ('Digital Marketing Associate', 'Meta', DATE '2023-02-01', 6),
    ('Email Marketing Mastery', 'Udemy', DATE '2022-06-01', 7),
    ('Copywriting for Conversions', 'Copyhackers', DATE '2023-09-01', 8),
    ('Marketing Analytics', 'Coursera', DATE '2024-01-01', 9),
    ('Lifecycle & Retention Marketing', 'CXL', DATE '2024-03-01', 10)
)
INSERT INTO public.certifications (niche_id, name, issuer, date_earned, sort_order)
SELECT n.id, d.name, d.issuer, d.date_earned, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.certifications c WHERE c.niche_id = n.id AND lower(c.name) = lower(d.name)
);

-- ------------------------------------------------------------
-- Email Marketer: brands worked with (text logos)
-- ------------------------------------------------------------
WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(alt_text, sort_order) AS (
  VALUES
    ('Allied Property', 1), ('Golden Coast', 2), ('Serene Path', 3),
    ('Motion Health', 4), ('Luxe Estate', 5), ('Blade & Beard', 6),
    ('Xpers', 7), ('Xanctum', 8)
)
INSERT INTO public.brand_logos (niche_id, logo_url, alt_text, bg_color, is_starred, sort_order)
SELECT n.id, '', d.alt_text, '#FFFFFF', true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.brand_logos b WHERE b.niche_id = n.id AND lower(b.alt_text) = lower(d.alt_text)
);

-- ------------------------------------------------------------
-- Email Marketer: starter story
-- ------------------------------------------------------------
INSERT INTO public.niche_stories (niche_id, story_text, quote)
SELECT n.id,
$story$I fell into email marketing because I loved the idea of a single message landing in someone's inbox and actually moving them to act.

What started as curiosity about subject lines and open rates grew into a craft: building lifecycle flows, segmenting audiences, designing emails that look beautiful in every client, and obsessing over deliverability so the work actually gets seen.

Today I help brands turn their email list into one of their most profitable channels — welcome flows, promos, win-backs and everything in between. Clean design, sharp copy, and numbers that go up.$story$,
  'The inbox is the most personal channel you own — treat it that way.'
FROM public.niches n
WHERE n.slug = 'email-marketer'
  AND NOT EXISTS (SELECT 1 FROM public.niche_stories s WHERE s.niche_id = n.id);

UPDATE public.niche_stories s
SET story_text = $story$I fell into email marketing because I loved the idea of a single message landing in someone's inbox and actually moving them to act.

What started as curiosity about subject lines and open rates grew into a craft: building lifecycle flows, segmenting audiences, designing emails that look beautiful in every client, and obsessing over deliverability so the work actually gets seen.

Today I help brands turn their email list into one of their most profitable channels — welcome flows, promos, win-backs and everything in between. Clean design, sharp copy, and numbers that go up.$story$
FROM public.niches n
WHERE s.niche_id = n.id AND n.slug = 'email-marketer'
  AND (s.story_text IS NULL OR btrim(s.story_text) = '');

-- ------------------------------------------------------------
-- Testimonials for Email Marketer (sample — editable in admin)
-- ------------------------------------------------------------
WITH n AS (SELECT id FROM public.niches WHERE slug = 'email-marketer'),
data(client_name, role, review_text, rating, sort_order) AS (
  VALUES
    ('Sarah Mitchell', 'Founder, Luxe Estate', 'Our email revenue nearly doubled in two months. The flows he built run on autopilot and the designs look incredible.', 5, 1),
    ('David Chen', 'Marketing Lead, Motion Health', 'Deliverability was killing us before. He cleaned everything up and our open rates jumped overnight.', 5, 2),
    ('Amara Okeke', 'CEO, Blade & Beard', 'Beautiful, on-brand emails and copy that actually converts. Easily one of the best hires we made.', 5, 3),
    ('Tomiwa Adeyemi', 'Growth, Xpers', 'He treats your list like a real asset. Segmentation and automations were a game changer for us.', 5, 4)
)
INSERT INTO public.testimonials (niche_id, client_name, role, review_text, rating, is_starred, sort_order)
SELECT n.id, d.client_name, d.role, d.review_text, d.rating, true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.testimonials t WHERE t.niche_id = n.id AND lower(t.client_name) = lower(d.client_name)
);

-- ------------------------------------------------------------
-- Testimonials for Full Stack (sample — editable in admin)
-- ------------------------------------------------------------
WITH n AS (SELECT id FROM public.niches WHERE slug = 'fullstack-developer'),
data(client_name, role, review_text, rating, sort_order) AS (
  VALUES
    ('Sarah Mitchell', 'Founder, Allied Property Compass', 'Daniel took our idea and shipped a polished, fast platform in record time. He owns the whole stack and it shows.', 5, 1),
    ('Daniel Roberts', 'Product Lead, Motion Health', 'Pixel-perfect, lightning fast, and he sweats the details nobody else does. Our launch could not have gone better.', 5, 2),
    ('Grace Adeyemi', 'CEO, Luxe Estate', 'He vibe-codes at a speed that is honestly hard to believe — without ever cutting corners on quality.', 5, 3),
    ('Michael Osei', 'Founder, Xpers', 'From database to deploy, he handled everything. Clean code, beautiful UI, zero hand-holding.', 5, 4)
)
INSERT INTO public.testimonials (niche_id, client_name, role, review_text, rating, is_starred, sort_order)
SELECT n.id, d.client_name, d.role, d.review_text, d.rating, true, d.sort_order
FROM n CROSS JOIN data d
WHERE NOT EXISTS (
  SELECT 1 FROM public.testimonials t WHERE t.niche_id = n.id AND lower(t.client_name) = lower(d.client_name)
);

-- ============================================================
-- Owner account: ensure allow-listed + best-effort provision with a known
-- password and confirmed email so sign-in works immediately. The whole block
-- is exception-guarded so a schema difference can never abort the migration.
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

INSERT INTO public.admin_emails (email) VALUES ('ogbeifundaniel0@gmail.com')
ON CONFLICT (email) DO NOTHING;

DO $$
DECLARE
  new_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = 'ogbeifundaniel0@gmail.com') THEN
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
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), new_id,
      json_build_object('sub', new_id::text, 'email', 'ogbeifundaniel0@gmail.com')::jsonb,
      'email', new_id::text, now(), now(), now()
    );
    INSERT INTO public.user_roles (user_id, role) VALUES (new_id, 'admin'::app_role)
      ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    -- Account already exists: just make sure it has the admin role.
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'::app_role FROM auth.users WHERE lower(email) = 'ogbeifundaniel0@gmail.com'
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'owner account seed skipped: %', SQLERRM;
END $$;
