
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Niches
CREATE TABLE public.niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.niche_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID UNIQUE REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  title TEXT,
  bio TEXT,
  hero_tagline TEXT,
  profile_picture_url TEXT,
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  location TEXT,
  projects_count INT DEFAULT 0,
  happy_clients INT DEFAULT 0,
  years_experience INT DEFAULT 0,
  primary_color TEXT DEFAULT '#2563EB',
  secondary_color TEXT DEFAULT '#0F172A',
  accent_color TEXT DEFAULT '#F59E0B',
  font_family TEXT DEFAULT 'Inter',
  animation_enabled BOOLEAN DEFAULT true,
  custom_css TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.niche_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID UNIQUE REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  story_text TEXT,
  image_url TEXT,
  quote TEXT
);

CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_starred BOOLEAN DEFAULT false
);

CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  percentage INT DEFAULT 80,
  icon TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  brand_name TEXT NOT NULL,
  category TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  platform TEXT,
  description TEXT,
  figma_link TEXT,
  external_link TEXT,
  is_starred BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT,
  date_earned DATE,
  badge_url TEXT,
  credential_link TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  review_text TEXT NOT NULL,
  rating INT DEFAULT 5,
  is_starred BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.brand_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  logo_url TEXT NOT NULL,
  alt_text TEXT,
  bg_color TEXT DEFAULT '#FFFFFF',
  is_starred BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.email_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  preview_url TEXT NOT NULL,
  description TEXT,
  client_name TEXT,
  is_starred BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.niche_homepage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE NOT NULL,
  section_name TEXT NOT NULL,
  max_display INT DEFAULT 6,
  UNIQUE (niche_id, section_name)
);

-- Enable RLS on all
ALTER TABLE public.niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niche_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niche_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niche_homepage_limits ENABLE ROW LEVEL SECURITY;

-- Public read + admin write policies (loop-style as separate statements)
CREATE POLICY "public read" ON public.niches FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.niches FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.niche_settings FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.niche_settings FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.niche_stories FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.niche_stories FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.social_links FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.skills FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.projects FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.certifications FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.testimonials FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.brand_logos FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.brand_logos FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.email_designs FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.email_designs FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read" ON public.niche_homepage_limits FOR SELECT USING (true);
CREATE POLICY "admin write" ON public.niche_homepage_limits FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for portfolio media
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;
CREATE POLICY "public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "admin upload portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin update portfolio" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin delete portfolio" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));
