
-- Upcoming updates -------------------------------------------------
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_ur text,
  body text NOT NULL DEFAULT '',
  body_ur text,
  pinned boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "announcements readable" ON public.announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "announcements admin insert" ON public.announcements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "announcements admin update" ON public.announcements FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "announcements admin delete" ON public.announcements FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Messages ----------------------------------------------------------
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX messages_thread_idx ON public.messages (recipient_id, created_at);
GRANT SELECT, INSERT, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages select" ON public.messages FOR SELECT TO authenticated
  USING (
    (recipient_id IS NULL AND (public.is_approved(auth.uid()) OR public.has_role(auth.uid(),'admin')))
    OR sender_id = auth.uid()
    OR recipient_id = auth.uid()
    OR public.has_role(auth.uid(),'admin')
  );
CREATE POLICY "messages insert" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND (public.is_approved(auth.uid()) OR public.has_role(auth.uid(),'admin'))
  );
CREATE POLICY "messages delete" ON public.messages FOR DELETE TO authenticated
  USING (sender_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Quizzes -----------------------------------------------------------
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'quiz',
  title text NOT NULL,
  title_ur text,
  description text,
  grade integer,
  subject text,
  points_per_question integer NOT NULL DEFAULT 1,
  is_published boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quizzes select" ON public.quizzes FOR SELECT TO authenticated
  USING (is_published OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));
CREATE POLICY "quizzes staff insert" ON public.quizzes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));
CREATE POLICY "quizzes staff update" ON public.quizzes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));
CREATE POLICY "quizzes staff delete" ON public.quizzes FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));

CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  prompt_ur text,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_index integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions staff read" ON public.quiz_questions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));
CREATE POLICY "questions staff insert" ON public.quiz_questions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));
CREATE POLICY "questions staff update" ON public.quiz_questions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));
CREATE POLICY "questions staff delete" ON public.quiz_questions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));

CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts select" ON public.quiz_attempts FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'));

-- Directories (names only, no contact details) -----------------------
CREATE VIEW public.member_directory AS
  SELECT id, full_name, requested_grade FROM public.profiles;
GRANT SELECT ON public.member_directory TO authenticated;

CREATE VIEW public.teacher_directory AS
  SELECT p.id, p.full_name, r.role::text AS role
  FROM public.profiles p
  JOIN public.user_roles r ON r.user_id = p.id
  WHERE r.role IN ('teacher','admin');
GRANT SELECT ON public.teacher_directory TO authenticated;

-- Quiz taking / leaderboard ------------------------------------------
CREATE OR REPLACE FUNCTION public.take_quiz(_quiz_id uuid)
RETURNS TABLE (id uuid, prompt text, prompt_ur text, options jsonb, sort_order integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT q.id, q.prompt, q.prompt_ur, q.options, q.sort_order
  FROM public.quiz_questions q
  JOIN public.quizzes z ON z.id = q.quiz_id
  WHERE q.quiz_id = _quiz_id
    AND z.is_published
    AND (public.is_approved(auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher'))
  ORDER BY q.sort_order, q.created_at
$$;
REVOKE EXECUTE ON FUNCTION public.take_quiz(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.take_quiz(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.submit_quiz(_quiz_id uuid, _answers jsonb)
RETURNS TABLE (score integer, total integer)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid := auth.uid();
  _score integer := 0;
  _total integer := 0;
  _pts integer := 1;
  q record;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF NOT (public.is_approved(_uid) OR public.has_role(_uid,'admin') OR public.has_role(_uid,'teacher')) THEN
    RAISE EXCEPTION 'Your account is awaiting approval';
  END IF;
  SELECT points_per_question INTO _pts FROM public.quizzes WHERE id = _quiz_id AND is_published;
  IF _pts IS NULL THEN RAISE EXCEPTION 'Quiz not available'; END IF;
  FOR q IN SELECT qq.id, qq.correct_index FROM public.quiz_questions qq WHERE qq.quiz_id = _quiz_id LOOP
    _total := _total + _pts;
    IF (_answers ->> q.id::text)::int IS NOT DISTINCT FROM q.correct_index THEN
      _score := _score + _pts;
    END IF;
  END LOOP;
  INSERT INTO public.quiz_attempts (quiz_id, user_id, score, total) VALUES (_quiz_id, _uid, _score, _total);
  RETURN QUERY SELECT _score, _total;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.submit_quiz(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_quiz(uuid, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.leaderboard()
RETURNS TABLE (user_id uuid, full_name text, requested_grade integer, points bigint, attempts bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT a.user_id, p.full_name, p.requested_grade,
         SUM(a.score)::bigint AS points, COUNT(*)::bigint AS attempts
  FROM public.quiz_attempts a
  JOIN public.profiles p ON p.id = a.user_id
  GROUP BY a.user_id, p.full_name, p.requested_grade
  ORDER BY points DESC, attempts ASC
  LIMIT 100
$$;
REVOKE EXECUTE ON FUNCTION public.leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.leaderboard() TO authenticated;
