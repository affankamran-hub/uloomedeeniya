-- 1. Announcements: restrict reads to signed-in users
DROP POLICY IF EXISTS "announcements readable" ON public.announcements;
CREATE POLICY "announcements readable by signed-in users"
ON public.announcements FOR SELECT TO authenticated
USING (true);
REVOKE SELECT ON public.announcements FROM anon;

-- 2. SECURITY DEFINER hardening: internal helpers must not be callable via the API
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.is_approved(uuid) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- App-facing RPCs: deny anonymous, and enforce in-function authorization
REVOKE ALL ON FUNCTION public.leaderboard() FROM anon, public;
REVOKE ALL ON FUNCTION public.member_names() FROM anon, public;
REVOKE ALL ON FUNCTION public.teacher_list() FROM anon, public;
REVOKE ALL ON FUNCTION public.take_quiz(uuid) FROM anon, public;
REVOKE ALL ON FUNCTION public.submit_quiz(uuid, jsonb) FROM anon, public;

CREATE OR REPLACE FUNCTION public.leaderboard()
RETURNS TABLE(user_id uuid, full_name text, requested_grade integer, points bigint, attempts bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT a.user_id, p.full_name, p.requested_grade,
         SUM(a.score)::bigint AS points, COUNT(*)::bigint AS attempts
  FROM public.quiz_attempts a
  JOIN public.profiles p ON p.id = a.user_id
  WHERE auth.uid() IS NOT NULL
    AND (public.is_approved(auth.uid())
         OR public.has_role(auth.uid(),'admin')
         OR public.has_role(auth.uid(),'teacher'))
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
    AND (public.is_approved(auth.uid())
         OR public.has_role(auth.uid(),'admin')
         OR public.has_role(auth.uid(),'teacher'))
$$;

CREATE OR REPLACE FUNCTION public.teacher_list()
RETURNS TABLE(id uuid, full_name text, role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT p.id, p.full_name, r.role::text
  FROM public.profiles p
  JOIN public.user_roles r ON r.user_id = p.id
  WHERE r.role IN ('teacher','admin') AND auth.uid() IS NOT NULL
$$;

GRANT EXECUTE ON FUNCTION public.leaderboard() TO authenticated;
GRANT EXECUTE ON FUNCTION public.member_names() TO authenticated;
GRANT EXECUTE ON FUNCTION public.teacher_list() TO authenticated;
GRANT EXECUTE ON FUNCTION public.take_quiz(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_quiz(uuid, jsonb) TO authenticated;

-- 3. quiz_attempts: keep client writes closed; scores are written only by submit_quiz
REVOKE INSERT, UPDATE, DELETE ON public.quiz_attempts FROM anon, authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;