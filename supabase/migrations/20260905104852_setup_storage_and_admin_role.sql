-- ============================================================
-- Migration: Setup materials storage bucket + grant admin role
-- to affankamranthebest@gmail.com
-- ============================================================

-- 1. Create the 'materials' storage bucket (if it doesn't exist already)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materials',
  'materials',
  false,           -- NOT public — signed URLs required
  52428800,        -- 50 MB max file size
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS: Allow admins to upload files
CREATE POLICY "admins can upload materials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'materials'
    AND public.has_role(auth.uid(), 'admin')
  );

-- 3. Storage RLS: Allow admins to delete files
CREATE POLICY "admins can delete materials"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'materials'
    AND public.has_role(auth.uid(), 'admin')
  );

-- 4. Storage RLS: Approved students + admins can read files
CREATE POLICY "approved members can read materials"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'materials'
    AND (
      public.has_role(auth.uid(), 'admin')
      OR public.is_approved(auth.uid())
    )
  );

-- 5. Grant admin role to affankamranthebest@gmail.com
-- NOTE: This only works AFTER the user has registered/signed up.
-- If they haven't signed up yet, sign up first and then re-run this.
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'affankamranthebest@gmail.com'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Give admin role (ignore if already assigned)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Also approve their profile
    UPDATE public.profiles
    SET approved = true
    WHERE id = v_user_id;

    RAISE NOTICE 'Admin role granted to affankamranthebest@gmail.com (user_id: %)', v_user_id;
  ELSE
    RAISE NOTICE 'User affankamranthebest@gmail.com not found. Please register/sign up first, then re-run this migration.';
  END IF;
END $$;
