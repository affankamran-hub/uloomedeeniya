CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _is_owner boolean := lower(COALESCE(NEW.email,'')) IN ('muslimgamer11@gmail.com','affankamranthebest@gmail.com');
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, requested_grade, approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    COALESCE(NEW.email,''),
    NEW.raw_user_meta_data->>'phone',
    NULLIF(NEW.raw_user_meta_data->>'requested_grade','')::int,
    _is_owner
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN _is_owner THEN 'admin'::app_role ELSE 'member'::app_role END)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

UPDATE public.profiles p
SET approved = true
FROM auth.users u
WHERE u.id = p.id
  AND lower(u.email) IN ('muslimgamer11@gmail.com','affankamranthebest@gmail.com');

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE lower(u.email) IN ('muslimgamer11@gmail.com','affankamranthebest@gmail.com')
ON CONFLICT DO NOTHING;