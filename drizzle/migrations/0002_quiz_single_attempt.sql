DELETE FROM public.quiz_attempts a USING public.quiz_attempts b
WHERE a.quiz_id = b.quiz_id AND a.user_id = b.user_id
  AND (a.created_at > b.created_at OR (a.created_at = b.created_at AND a.id > b.id));
CREATE UNIQUE INDEX IF NOT EXISTS quiz_attempts_one_per_user ON public.quiz_attempts (quiz_id, user_id);