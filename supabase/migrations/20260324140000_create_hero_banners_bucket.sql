INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-banners', 'hero-banners', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Anyone can view hero banner files'
  ) THEN
    CREATE POLICY "Anyone can view hero banner files"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'hero-banners');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload hero banner files'
  ) THEN
    CREATE POLICY "Authenticated users can upload hero banner files"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'hero-banners');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update hero banner files'
  ) THEN
    CREATE POLICY "Authenticated users can update hero banner files"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'hero-banners')
      WITH CHECK (bucket_id = 'hero-banners');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete hero banner files'
  ) THEN
    CREATE POLICY "Authenticated users can delete hero banner files"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'hero-banners');
  END IF;
END $$;
