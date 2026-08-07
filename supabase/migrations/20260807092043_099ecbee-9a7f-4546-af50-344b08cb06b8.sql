CREATE POLICY "materials admin insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "materials admin update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'))
WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "materials admin delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'materials' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "materials read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'materials' AND (public.is_approved(auth.uid()) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'teacher')));