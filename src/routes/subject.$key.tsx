import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Download, CheckCircle2, ArrowRight } from "lucide-react";
import tafheemPdf from "@/assets/tafheem-1.pdf.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { ContentCards, type ContentRow } from "@/components/ContentSection";
import { GRADES, SUBJECTS, CATEGORIES, subjectName } from "@/lib/site";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <h1 className="text-2xl font-bold">Subject not found</h1>
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <BookOpen className="size-4" /> Core Subject / بنیادی مضمون
            </div>
            <h1 className="mt-1 text-3xl font-bold md:text-4xl">{subject.en}</h1>
            <p className="urdu text-2xl text-primary font-medium">{subject.ur}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/grades">All Grades Curriculum →</Link>
          </Button>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-base font-semibold text-foreground">{subject.meaning}</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{subject.detail}</p>
          <p className="urdu mt-2 text-sm leading-loose text-muted-foreground">
            {subject.detailUr}
          </p>
        </div>

        <Tabs defaultValue="1" className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Select Grade / درجہ منتخب کیجیے:</p>
            <TabsList className="flex h-auto flex-wrap justify-start gap-1">
              {GRADES.map((g) => (
                <TabsTrigger key={g.n} value={String(g.n)} className="flex-col py-1.5 px-3">
                  <span className="text-xs font-medium">{g.en}</span>
                  <span className="urdu text-[11px]">{g.ur}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {GRADES.map((g) => {
            const forGrade = items.filter((i) => i.grade === g.n);
            const isTafheemGradeOne = key === "tafheem" && g.n === 1;
            const isTajweedGradeOne = key === "tajweed" && g.n === 1;
            const isHadithGradeOne = key === "hadith" && g.n === 1;

            return (
              <TabsContent key={g.n} value={String(g.n)} className="mt-8 space-y-8">
                {/* Official Syllabus Book Highlight for Grade 1 Tafheem ud Din */}
                {isTafheemGradeOne && (
                  <Card className="card-soft border-primary/40 bg-primary/5 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Official Textbook / نصاب کی کتاب
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">Grade 1 • تفہیم الدین</span>
                      </div>
                      <CardTitle className="mt-2 text-xl font-bold">
                        Tafheem ud Din — Grade 1 Complete Coursebook
                      </CardTitle>
                      <p className="urdu text-lg text-primary">تفہیم الدین — درجہ اولیٰ مکمل درسی کتاب</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Official course manual published for Grade 1 students of Ma'had al-Uloom (Tauheed Trust). Includes foundational lessons on Islamic creed, understanding of Qur'an, and practical religious etiquette.
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button asChild variant="gold" size="sm" className="font-semibold shadow">
                          <a href={tafheemPdf.url} target="_blank" rel="noreferrer" className="gap-1.5">
                            <FileText className="size-4" /> Open Coursebook PDF / کتاب کھولیں
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a href={tafheemPdf.url} download="tafheem-ud-din-grade-1.pdf" className="gap-1.5">
                            <Download className="size-4" /> Download / ڈاؤنلوڈ
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Official Syllabus Qaida for Grade 1 Tajweed ul Qur'an */}
                {isTajweedGradeOne && (
                  <Card className="card-soft border-gold/50 bg-gold/5 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Badge variant="gold" className="font-semibold">
                          Official Curriculum / بنیادی درسی قاعدہ
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">Grade 1 • تجوید القرآن</span>
                      </div>
                      <CardTitle className="mt-2 text-xl font-bold">
                        Darussalam Qurani Qaida — تجوید القرآن
                      </CardTitle>
                      <p className="urdu text-lg text-primary">دارالسلام قرآنی قاعدہ — تالیف: استاذ القراء قاری محمد ادریس العاصم</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Official comprehensive Tajweed Qaida for Grade 1 students. Includes illustrated Makhaarij al-Huroof (مخارج الحروف), rules of Noon &amp; Meem Sakinah, Tanween, Maddat, Waqf principles, and complete Masnoon prayers.
                      </p>
                      <p className="urdu text-sm leading-loose text-muted-foreground">
                        مخارج الحروف اور مختصر قواعد تجوید پر مشتمل پہلا باتصویر قاعدہ، مع مسنون نماز، اذکار اور قرآنی رموز اوقاف۔
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button asChild variant="gold" size="sm" className="font-semibold shadow">
                          <a href="/tajweed-ul-quran-grade-1-qaida.pdf" target="_blank" rel="noreferrer" className="gap-1.5">
                            <FileText className="size-4" /> Open Qurani Qaida PDF / قاعدہ کھولیں
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a href="/tajweed-ul-quran-grade-1-qaida.pdf" download="darussalam-qurani-qaida-grade-1.pdf" className="gap-1.5">
                            <Download className="size-4" /> Download PDF / ڈاؤنلوڈ
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Official Syllabus Book for Grade 1 Usool e Hadith */}
                {isHadithGradeOne && (
                  <Card className="card-soft border-emerald-500/40 bg-emerald-500/5 shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Badge variant="default" className="bg-emerald-600 text-white font-semibold">
                          Official Coursebook / بنیادی نصابی کتاب
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">Grade 1 • اصول حدیث</span>
                      </div>
                      <CardTitle className="mt-2 text-xl font-bold">
                        Usool e Hadith — Grade 1 (الدرجة الأولی)
                      </CardTitle>
                      <p className="urdu text-lg text-primary">اصول حدیث — دورۃ العلوم الدینیۃ، معھد العلوم الاسلامیۃ باکستان</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Official comprehensive textbook for Grade 1 Usool e Hadith. Covers foundational rules of Hadith sciences, Sanad &amp; Matn, Khabar Mutawatir &amp; Wahid, Hadith Sahih, Hasan, Dhaeef, Inqita', and Ilm al-Jarh wat-Ta'deel.
                      </p>
                      <p className="urdu text-sm leading-loose text-muted-foreground">
                        علوم الحدیث میں استعمال ہونے والی اصطلاحات کی تعریف، راویوں کے متعلق معلومات، تخریج و تطبیق الحدیث اور محدثین کرام کی کاوشیں۔
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button asChild variant="gold" size="sm" className="font-semibold shadow">
                          <a href="/usool-e-hadith-grade-1.pdf" target="_blank" rel="noreferrer" className="gap-1.5">
                            <FileText className="size-4" /> Open Coursebook PDF / کتاب کھولیں
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a href="/usool-e-hadith-grade-1.pdf" download="usool-e-hadith-grade-1.pdf" className="gap-1.5">
                            <Download className="size-4" /> Download PDF / ڈاؤنلوڈ
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isLoading && <Skeleton className="h-32" />}

                {!isLoading && forGrade.length === 0 && !isTafheemGradeOne && !isTajweedGradeOne && !isHadithGradeOne && (
                  <div className="rounded-xl border border-dashed border-border p-10 text-center">
                    <p className="text-sm font-medium text-foreground">
                      No additional study material published for Grade {g.n} yet.
                    </p>
                    <p className="urdu text-sm text-muted-foreground mt-1">
                      درجہ {g.ur} کے لیے اضافی مواد جلد اپلوڈ کیا جائے گا۔
                    </p>
                  </div>
                )}

                {CATEGORIES.map((cat) => {
                  const list = forGrade.filter((i) => i.category === cat.key);
                  if (list.length === 0) return null;
                  return (
                    <div key={cat.key}>
                      <h2 className="mb-3 text-xl font-semibold flex items-center gap-2">
                        <span>{cat.en}</span>
                        <span className="urdu text-primary font-normal">{cat.ur}</span>
                      </h2>
                      <ContentCards items={list} />
                    </div>
                  );
                })}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Other Subjects navigation */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Other Subjects / دیگر مضامین</p>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.filter((s) => s.key !== key).map((s) => (
              <Button key={s.key} asChild variant="outline" size="sm" className="hover:border-primary">
                <Link to="/subject/$key" params={{ key: s.key }} className="gap-1">
                  <span>{s.en}</span>
                  <span className="urdu text-xs text-muted-foreground">({s.ur})</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
