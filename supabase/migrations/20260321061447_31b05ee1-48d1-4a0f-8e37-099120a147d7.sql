
-- Create notices table for admin-managed scrolling notices
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Anyone can read active notices
CREATE POLICY "Anyone can read active notices" ON public.notices
  FOR SELECT USING (is_active = true);

-- Authenticated users can manage notices
CREATE POLICY "Authenticated users can insert notices" ON public.notices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update notices" ON public.notices
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete notices" ON public.notices
  FOR DELETE TO authenticated USING (true);

-- Create gallery_images table if not exists
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Academics',
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Gallery policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_images' AND policyname = 'Anyone can view gallery images') THEN
    CREATE POLICY "Anyone can view gallery images" ON public.gallery_images FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_images' AND policyname = 'Authenticated users can insert gallery images') THEN
    CREATE POLICY "Authenticated users can insert gallery images" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery_images' AND policyname = 'Authenticated users can delete gallery images') THEN
    CREATE POLICY "Authenticated users can delete gallery images" ON public.gallery_images FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- Insert default notices
INSERT INTO public.notices (text) VALUES
  ('📢 Admissions Open for 2025-26 Session — Nursery to 12th — Contact: 7070422574'),
  ('🎓 Get Admission in LPU, Galgotias, Parul, TMU & More Top Universities'),
  ('📚 APS Classes — Quality Education by Munna Sir — Jagdishpur, West Champaran');
