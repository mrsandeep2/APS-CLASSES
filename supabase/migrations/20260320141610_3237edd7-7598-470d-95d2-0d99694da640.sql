
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view gallery files"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can delete gallery files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');
