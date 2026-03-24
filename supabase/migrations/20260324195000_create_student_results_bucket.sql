INSERT INTO storage.buckets (id, name, public)
VALUES ('student-results', 'student-results', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Anyone can view student result photos'
  ) THEN
    CREATE POLICY "Anyone can view student result photos"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'student-results');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload student result photos'
  ) THEN
    CREATE POLICY "Authenticated users can upload student result photos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'student-results');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update student result photos'
  ) THEN
    CREATE POLICY "Authenticated users can update student result photos"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'student-results')
      WITH CHECK (bucket_id = 'student-results');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete student result photos'
  ) THEN
    CREATE POLICY "Authenticated users can delete student result photos"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'student-results');
  END IF;
END $$;
