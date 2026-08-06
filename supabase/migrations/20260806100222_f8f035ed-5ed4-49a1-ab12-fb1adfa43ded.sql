
CREATE TABLE public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ai_messages_user_idx ON public.ai_messages (user_id, created_at);
GRANT SELECT, INSERT, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own ai messages select" ON public.ai_messages FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own ai messages insert" ON public.ai_messages FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own ai messages delete" ON public.ai_messages FOR DELETE TO authenticated USING (user_id = auth.uid());
