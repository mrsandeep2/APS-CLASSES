CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  cta_label TEXT,
  cta_link TEXT,
  cta_secondary_label TEXT,
  cta_secondary_link TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero banners" ON public.hero_banners FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can view all hero banners" ON public.hero_banners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert hero banners" ON public.hero_banners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update hero banners" ON public.hero_banners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete hero banners" ON public.hero_banners FOR DELETE TO authenticated USING (true);
