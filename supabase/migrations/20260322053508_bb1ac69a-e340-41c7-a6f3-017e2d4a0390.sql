
CREATE TABLE public.student_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL DEFAULT 'Class 10th',
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  marks_obtained INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 500,
  grade TEXT NOT NULL DEFAULT 'A',
  year TEXT NOT NULL DEFAULT '2024-25',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view student results" ON public.student_results FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert student results" ON public.student_results FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update student results" ON public.student_results FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete student results" ON public.student_results FOR DELETE TO authenticated USING (true);
