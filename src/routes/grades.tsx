import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { ContentCards, useContent } from "@/components/ContentSection";
import { GRADES, SUBJECTS, CATEGORIES } from "@/lib/site";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/grades")({
  validateSearch: z.object({ grade: z.number().min(1).max(5).optional() }),
  head: () => ({
    meta: [
      { title: "Grades & Subjects | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content:
          "Grade one to grade five (درجہ اولیٰ تا درجہ خامس) course outlines and study material for Uloom e Deeniya, Karachi.",
      },
      { property: "og:title", content: "Grades & Subjects | Uloom e Deeniya" },
      { property: "og:description", content: "Five grades, five subjects of religious study." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GradesPage,
});

function GradePanel({ grade }: { grade: number }) {
  const { data, isLoading } = useContent(undefined, grade);
  const items = data ?? [];
  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((s) => (
          <Link key={s.key} to="/subject/$key" params={{ key: s.key }} className="block">
          <Card className="card-soft h-full transition-colors hover:border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{s.en}</CardTitle>
              <p className="urdu text-lg text-primary">{s.ur}</p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{s.meaning}</p>
              <p className="text-muted-foreground">{s.detail}</p>
              <p className="urdu leading-loose text-muted-foreground">{s.detailUr}</p>
              <p className="pt-1 font-medium text-primary">Open subject →</p>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>

      {CATEGORIES.map((cat) => {
        const list = items.filter((i) => i.category === cat.key);
        if (list.length === 0) return null;
        return (
          <div key={cat.key}>
            <h3 className="mb-3 text-xl">
              {cat.en} <span className="urdu text-primary">{cat.ur}</span>
            </h3>
            <ContentCards items={list} />
          </div>
        );
      })}

      {isLoading && <Skeleton className="h-32" />}
      {!isLoading && items.length === 0 && (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Material for this grade will be published soon. <span className="urdu">جلد شائع کیا جائے گا۔</span>
        </p>
      )}
    </div>
  );
}

function GradesPage() {
  const { grade } = Route.useSearch();
  const navigate = Route.useNavigate();
  const active = String(grade ?? 1);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl">Grades</h1>
        <p className="urdu text-xl text-primary">درجات</p>
        <Tabs
          value={active}
          onValueChange={(v) => navigate({ search: { grade: Number(v) } })}
          className="mt-8"
        >
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            {GRADES.map((g) => (
              <TabsTrigger key={g.n} value={String(g.n)} className="flex-col py-2">
                <span className="text-sm">{g.en}</span>
                <span className="urdu text-xs">{g.ur}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {GRADES.map((g) => (
            <TabsContent key={g.n} value={String(g.n)} className="mt-8">
              <GradePanel grade={g.n} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SiteLayout>
  );
}
