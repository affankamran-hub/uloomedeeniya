import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useSetting<T>(key: string, fallback: T) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["setting", key],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return (data?.value as T | undefined) ?? null;
    },
  });
  const save = async (value: T) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value: value as never, updated_at: new Date().toISOString() });
    if (error) {
      toast.error(error.message);
      return false;
    }
    qc.setQueryData(["setting", key], value);
    toast.success("Saved / محفوظ ہو گیا");
    return true;
  };
  return { value: (q.data ?? fallback) as T, save };
}
