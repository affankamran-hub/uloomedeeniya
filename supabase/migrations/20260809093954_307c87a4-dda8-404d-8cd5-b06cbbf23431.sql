CREATE OR REPLACE FUNCTION public.leaderboard()
RETURNS TABLE(user_id uuid, full_name text, requested_grade integer, points bigint, attempts bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT a.user_id, p.full_name, p.requested_grade,
         SUM(a.score)::bigint AS points, COUNT(*)::bigint AS attempts
  FROM public.quiz_attempts a
  JOIN public.profiles p ON p.id = a.user_id
  WHERE auth.uid() IS NOT NULL
    AND (private.is_approved(auth.uid())
         OR private.has_role(auth.uid(),'admin')
         OR private.has_role(auth.uid(),'teacher'))
  GROUP BY a.user_id, p.full_name, p.requested_grade
  ORDER BY points DESC, attempts ASC
  LIMIT 100
$$;

CREATE OR REPLACE FUNCTION public.member_names()
RETURNS TABLE(id uuid, full_name text, requested_grade integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT p.id, p.full_name, p.requested_grade
  FROM public.profiles p
  WHERE auth.uid() IS NOT NULL
    AND (private.is_approved(auth.uid())
         OR private.has_role(auth.uid(),'admin')
         OR private.has_role(auth.uid(),'teacher'))
$$;

CREATE OR REPLACE FUNCTION public.submit_quiz(_quiz_id uuid, _answers jsonb)
RETURNS TABLE(score integer, total integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  _uid uuid := auth.uid();
  _score integer := 0;
  _total integer := 0;
  _pts integer := 1;
  q record;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF NOT (private.is_approved(_uid) OR private.has_role(_uid,'admin') OR private.has_role(_uid,'teacher')) THEN
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

CREATE OR REPLACE FUNCTION public.take_quiz(_quiz_id uuid)
RETURNS TABLE(id uuid, prompt text, prompt_ur text, options jsonb, sort_order integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT q.id, q.prompt, q.prompt_ur, q.options, q.sort_order
  FROM public.quiz_questions q
  JOIN public.quizzes z ON z.id = q.quiz_id
  WHERE q.quiz_id = _quiz_id
    AND z.is_published
    AND (private.is_approved(auth.uid()) OR private.has_role(auth.uid(),'admin') OR private.has_role(auth.uid(),'teacher'))
  ORDER BY q.sort_order, q.created_at
$$;