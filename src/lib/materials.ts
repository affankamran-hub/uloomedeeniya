import { supabase } from "@/integrations/supabase/client";

export const STORAGE_PREFIX = "storage:";
export const MATERIALS_BUCKET = "materials";

export const isStorageUrl = (url?: string | null): boolean =>
  !!url && url.startsWith(STORAGE_PREFIX);

export const storagePath = (url: string) => url.slice(STORAGE_PREFIX.length);

export async function signedMaterialUrl(url: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .createSignedUrl(storagePath(url), 60 * 60);
  if (error || !data) throw new Error(error?.message ?? "Could not open this file");
  return data.signedUrl;
}
