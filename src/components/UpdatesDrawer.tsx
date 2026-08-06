import { useQuery } from "@tanstack/react-query";
import { Megaphone, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type Announcement = {
  id: string;
  title: string;
  title_ur: string | null;
  body: string;
  body_ur: string | null;
  pinned: boolean;
  created_at: string;
};

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Announcement[];
    },
  });
}

export function UpdatesDrawer() {
  const { data, isLoading } = useAnnouncements();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="onDark" className="gap-2">
          <Megaphone className="size-4" />
          <span className="hidden sm:inline">Upcoming updates</span>
          <span className="urdu text-xs">آئندہ اطلاعات</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Upcoming updates <span className="urdu ms-2 text-base">آئندہ اطلاعات</span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && (data ?? []).length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No updates yet. <span className="urdu">ابھی کوئی اطلاع نہیں۔</span>
            </p>
          )}
          {(data ?? []).map((a) => (
            <article key={a.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                {a.pinned && (
                  <Badge variant="secondary" className="gap-1">
                    <Pin className="size-3" /> Pinned
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="mt-2 text-base font-medium text-foreground">{a.title}</h3>
              {a.title_ur && <p className="urdu text-sm text-primary">{a.title_ur}</p>}
              {a.body && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{a.body}</p>}
              {a.body_ur && (
                <p className="urdu mt-2 whitespace-pre-line text-sm text-muted-foreground">{a.body_ur}</p>
              )}
            </article>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}