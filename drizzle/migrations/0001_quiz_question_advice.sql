ALTER TABLE public.quiz_questions ADD COLUMN IF NOT EXISTS advice text;

CREATE OR REPLACE FUNCTION public.quiz_advice(_quiz_id uuid)
 RETURNS TABLE(id uuid, prompt text, advice text, sort_order integer)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT q.id, q.prompt, q.advice, q.sort_order
  FROM public.quiz_questions q
  WHERE q.quiz_id = _quiz_id
    AND q.advice IS NOT NULL AND q.advice <> ''
    AND EXISTS (SELECT 1 FROM public.quiz_attempts a WHERE a.quiz_id = _quiz_id AND a.user_id = auth.uid())
  ORDER BY q.sort_order, q.created_at
$$;
REVOKE EXECUTE ON FUNCTION public.quiz_advice(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.quiz_advice(uuid) TO authenticated;