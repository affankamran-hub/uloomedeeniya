CREATE OR REPLACE FUNCTION public.submit_quiz(_quiz_id uuid, _answers jsonb)
 RETURNS TABLE(score integer, total integer)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
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
  IF EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.quiz_id = _quiz_id AND a.user_id = _uid) THEN
    RAISE EXCEPTION 'You have already submitted this quiz';
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
$function$;

GRANT UPDATE, DELETE ON public.quiz_attempts TO authenticated;
CREATE POLICY "attempts admin update" ON public.quiz_attempts FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "attempts admin delete" ON public.quiz_attempts FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(),'admin'));

GRANT UPDATE ON public.messages TO authenticated;
CREATE POLICY "messages admin update" ON public.messages FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

CREATE POLICY "admin read ai messages" ON public.ai_messages FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete ai messages" ON public.ai_messages FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(),'admin'));

CREATE POLICY "admin insert profiles" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(),'admin'));