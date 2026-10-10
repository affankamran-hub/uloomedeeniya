CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "settings admin update" ON public.site_settings FOR UPDATE TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));
CREATE POLICY "settings admin delete" ON public.site_settings FOR DELETE TO authenticated USING (private.has_role(auth.uid(),'admin'));