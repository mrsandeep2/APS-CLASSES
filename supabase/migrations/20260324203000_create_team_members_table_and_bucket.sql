CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Munna Sir',
  role TEXT NOT NULL DEFAULT 'Director & Founder',
  qualification TEXT,
  point_one TEXT,
  point_two TEXT,
  mobile_number TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'team_members'
      AND policyname = 'Anyone can view team members'
  ) THEN
    CREATE POLICY "Anyone can view team members"
      ON public.team_members FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'team_members'
      AND policyname = 'Authenticated users can insert team members'
  ) THEN
    CREATE POLICY "Authenticated users can insert team members"
      ON public.team_members FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'team_members'
      AND policyname = 'Authenticated users can update team members'
  ) THEN
    CREATE POLICY "Authenticated users can update team members"
      ON public.team_members FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'team_members'
      AND policyname = 'Authenticated users can delete team members'
  ) THEN
    CREATE POLICY "Authenticated users can delete team members"
      ON public.team_members FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('team-members', 'team-members', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Anyone can view team member photos'
  ) THEN
    CREATE POLICY "Anyone can view team member photos"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'team-members');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can upload team member photos'
  ) THEN
    CREATE POLICY "Authenticated users can upload team member photos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'team-members');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can update team member photos'
  ) THEN
    CREATE POLICY "Authenticated users can update team member photos"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'team-members')
      WITH CHECK (bucket_id = 'team-members');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Authenticated users can delete team member photos'
  ) THEN
    CREATE POLICY "Authenticated users can delete team member photos"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'team-members');
  END IF;
END $$;
