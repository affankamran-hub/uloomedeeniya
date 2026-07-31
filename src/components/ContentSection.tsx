import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FileText, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GRADES, subjectName } from "@/lib/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export type ContentRow = {
  id: string;
  category: string;
  grade: number | null;
  subject: string | null;
  title: string;
  title_ur: string | null;
  description: string | null;
  url: string | null;
  event_date: string | null;
};

export function useContent(category?: string, grade?: number) {
  return useQuery({
    queryKey: ["content", category ?? "all", grade ?? "all"],
    queryFn: async () => {
      let q = supabase.from("content").select("*").order("created_at", { ascending: false });
      if (category) q = q.eq("category", category);
      if (grade) q = q.eq("grade", grade);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as ContentRow[];
    },
  });
}

export function ContentCards({ items }: { items: ContentRow[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
        Nothing published here yet. <span className="urdu">ابھی کچھ شائع نہیں ہوا۔</span>
      </p>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id} className="card-soft border-border/70">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {item.grade && (
                <Badge variant="secondary">
                  {GRADES.find((g) => g.n === item.grade)?.en}
                </Badge>
              )}
              {subjectName(item.subject) && (
                <Badge variant="outline">{subjectName(item.subject)!.en}</Badge>
              )}
            </div>
            <CardTitle className="mt-2 text-lg">{item.title}</CardTitle>
            {item.title_ur && <p className="urdu text-base text-muted-foreground">{item.title_ur}</p>}
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {item.description && <p>{item.description}</p>}
            {item.event_date && (
              <p className="flex items-center gap-2 text-foreground">
                <CalendarDays className="size-4" />
                {new Date(item.event_date).toLocaleString()}
              </p>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
              >
                {item.url.endsWith(".pdf") ? <FileText className="size-4" /> : <Link2 className="size-4" />}
                Open
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CategoryPage({
  category,
  titleEn,
  titleUr,
  intro,
}: {
  category: string;
  titleEn: string;
  titleUr: string;
  intro: string;
}) {
  const { data, isLoading } = useContent(category);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl text-foreground">{titleEn}</h1>
      <p className="urdu text-xl text-primary">{titleUr}</p>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>
      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : (
          <ContentCards items={data ?? []} />
        )}
      </div>
    </div>
  );
}
