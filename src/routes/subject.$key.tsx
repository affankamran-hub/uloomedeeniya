import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { ContentCards, type ContentRow } from "@/components/ContentSection";
import { GRADES, SUBJECTS, CATEGORIES, subjectName } from "@/lib/site";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/subject/$key")({
  head: ({ params }) => {
    const s = subjectName(params.key);
    const title = s ? `${s.en} (${s.ur}) | Uloom e Deeniya` : "Subject | Uloom e Deeniya";
    const description = s ? s.detail : "Subject material of Uloom e Deeniya, Tauheed Trust.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ params }) => {
    if (!subjectName(params.key)) throw notFound();
    return {};
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl">Subject not found</h1>
        <p className="urdu text-lg text-primary">یہ مضمون موجود نہیں</p>
        <Button asChild className="mt-6"><Link to="/">Back to home</Link></Button>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-sm text-muted-foreground">
        Something went wrong loading this subject.
      </div>
    </SiteLayout>
  ),
  component: SubjectPage,
});

function useSubjectContent(subject: string) {
  return useQuery({
    queryKey: ["content", "subject", subject],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("subject", subject)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as ContentRow[];
    },
  });
}

function SubjectPage() {
  const { key } = Route.useParams();
  const subject = subjectName(key)!;
  const { data, isLoading } = useSubjectContent(key);
  const items = data ?? [];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl">{subject.en}</h1>
        <p className="urdu text-2xl text-primary">{subject.ur}</p>
        <p className="mt-2 font-medium">{subject.meaning}</p>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{subject.detail}</p>
        <p className="urdu mt-1 max-w-3xl text-sm leading-loose text-muted-foreground">
          {subject.detailUr}
        </p>

        <Tabs defaultValue="1" className="mt-10">
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            {GRADES.map((g) => (
              <TabsTrigger key={g.n} value={String(g.n)} className="flex-col py-2">
                <span className="text-sm">{g.en}</span>
                <span className="urdu text-xs">{g.ur}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {GRADES.map((g) => {
            const forGrade = items.filter((i) => i.grade === g.n);
            return (
              <TabsContent key={g.n} value={String(g.n)} className="mt-8 space-y-8">
                {isLoading && <Skeleton className="h-32" />}
                {!isLoading && forGrade.length === 0 && (
                  <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No material published for this grade yet.{" "}
                    <span className="urdu">ابھی کچھ شائع نہیں ہوا۔</span>
                  </p>
                )}
                {CATEGORIES.map((cat) => {
                  const list = forGrade.filter((i) => i.category === cat.key);
                  if (list.length === 0) return null;
                  return (
                    <div key={cat.key}>
                      <h2 className="mb-3 text-xl">
                        {cat.en} <span className="urdu text-primary">{cat.ur}</span>
                      </h2>
                      <ContentCards items={list} />
                    </div>
                  );
                })}
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="mt-12 flex flex-wrap gap-2">
          {SUBJECTS.filter((s) => s.key !== key).map((s) => (
            <Button key={s.key} asChild variant="outline" size="sm">
              <Link to="/subject/$key" params={{ key: s.key }}>{s.en}</Link>
            </Button>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
