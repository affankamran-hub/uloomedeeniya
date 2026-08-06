
DROP VIEW IF EXISTS public.member_directory;
DROP VIEW IF EXISTS public.teacher_directory;

CREATE OR REPLACE FUNCTION public.member_names()
RETURNS TABLE (id uuid, full_name text, requested_grade integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.full_name, p.requested_grade
  FROM public.profiles p
  WHERE auth.uid() IS NOT NULL
$$;
REVOKE EXECUTE ON FUNCTION public.member_names() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.member_names() TO authenticated;

CREATE OR REPLACE FUNCTION public.teacher_list()
RETURNS TABLE (id uuid, full_name text, role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.full_name, r.role::text
  FROM public.profiles p
  JOIN public.user_roles r ON r.user_id = p.id
  WHERE r.role IN ('teacher','admin') AND auth.uid() IS NOT NULL
$$;
REVOKE EXECUTE ON FUNCTION public.teacher_list() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teacher_list() TO authenticated;
