-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  track text,
  year integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles own" ON public.profiles FOR ALL TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

-- Mastery per lesson/concept
CREATE TABLE public.mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text NOT NULL,
  course_id text NOT NULL,
  level text NOT NULL DEFAULT 'learned',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mastery TO authenticated;
GRANT ALL ON public.mastery TO service_role;
ALTER TABLE public.mastery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mastery own" ON public.mastery FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX mastery_user_idx ON public.mastery(user_id);

-- Mistakes with failure-mode cause
CREATE TABLE public.mistakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  topic text NOT NULL,
  cause text NOT NULL,
  detail text NOT NULL DEFAULT '',
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mistakes TO authenticated;
GRANT ALL ON public.mistakes TO service_role;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mistakes own" ON public.mistakes FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX mistakes_user_idx ON public.mistakes(user_id);

-- Knowledge base notes (incl. paper notes)
CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL DEFAULT 'note',
  ref_id text,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes own" ON public.notes FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX notes_user_idx ON public.notes(user_id);

-- Real university courses for the GPA engine
CREATE TABLE public.university_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL,
  title text NOT NULL DEFAULT '',
  credits numeric NOT NULL DEFAULT 3,
  grade_points numeric,
  target_points numeric,
  semester text NOT NULL DEFAULT 'current',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.university_courses TO authenticated;
GRANT ALL ON public.university_courses TO service_role;
ALTER TABLE public.university_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "uni own" ON public.university_courses FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX uni_user_idx ON public.university_courses(user_id);

-- Papers read / reproduced
CREATE TABLE public.paper_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  paper_id text NOT NULL,
  stage text NOT NULL DEFAULT 'abstract',
  read_done boolean NOT NULL DEFAULT false,
  reproduction_status text NOT NULL DEFAULT 'not started',
  explanation text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, paper_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.paper_progress TO authenticated;
GRANT ALL ON public.paper_progress TO service_role;
ALTER TABLE public.paper_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "paper own" ON public.paper_progress FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- Experiments / benchmark runs
CREATE TABLE public.experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  model text NOT NULL DEFAULT '',
  dataset text NOT NULL DEFAULT '',
  config text NOT NULL DEFAULT '',
  metric text NOT NULL DEFAULT '',
  result text NOT NULL DEFAULT '',
  conclusion text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'planned',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.experiments TO authenticated;
GRANT ALL ON public.experiments TO service_role;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "experiments own" ON public.experiments FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX experiments_user_idx ON public.experiments(user_id);

-- Research ideas / projects
CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  problem text NOT NULL DEFAULT '',
  approach text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Intermediate',
  status text NOT NULL DEFAULT 'idea',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO authenticated;
GRANT ALL ON public.ideas TO service_role;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ideas own" ON public.ideas FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX ideas_user_idx ON public.ideas(user_id);

-- Study sessions & attempts
CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  problem_id text NOT NULL,
  mode text NOT NULL DEFAULT 'practice',
  answer text NOT NULL DEFAULT '',
  self_score integer,
  minutes integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attempts TO authenticated;
GRANT ALL ON public.attempts TO service_role;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts own" ON public.attempts FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX attempts_user_idx ON public.attempts(user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
