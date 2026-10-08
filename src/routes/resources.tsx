import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Download, FileText, Award, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryPage } from "@/components/ContentSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import tafheemPdf from "@/assets/tafheem-1.pdf.asset.json";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Study Resources & Textbooks | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content:
          "Official textbooks, Darussalam Qurani Qaida, study material, and examination results for all five subjects of Uloom e Deeniya, Karachi.",
      },
      { property: "og:title", content: "Resources | Uloom e Deeniya, Tauheed Trust" },
      {
        property: "og:description",
        content: "Download official textbooks and study materials in the way of Allah.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 pt-12 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1">
            <Sparkles className="size-3.5" /> Official Curriculum &amp; Library / نصاب و درسی کتب
          </div>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Study Resources &amp; Textbooks</h1>
          <p className="urdu text-2xl text-primary font-medium">کتب، درسی مواد اور امتحانی دستاویزات</p>
        </div>

        {/* Featured Core Coursebooks */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Tajweed ul Quran Grade 1 Qaida */}
          <Card className="card-soft border-gold/40 bg-card shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="secondary" className="font-semibold bg-gold text-primary">Grade 1 • تجوید القرآن</Badge>
                  <span className="text-xs text-muted-foreground font-mono">PDF (5.7 MB)</span>
                </div>
                <CardTitle className="text-lg font-bold mt-2">Darussalam Qurani Qaida</CardTitle>
                <p className="urdu text-base text-primary">دارالسلام قرآنی قاعدہ — باتصویر قواعد تجوید</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Official illustrated Tajweed Qaida by Qari Muhammad Idris al-Asim. Covers Makhaarij, Tanween, Noon &amp; Meem Sakinah, and Masnoon prayers.
                </p>
              </CardContent>
            </div>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                <Button asChild variant="gold" size="sm" className="font-semibold text-xs h-8">
                  <a href="/tajweed-ul-quran-grade-1-qaida.pdf" target="_blank" rel="noreferrer" className="gap-1.5">
                    <FileText className="size-3.5" /> Open / کھولیں
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-xs h-8">
                  <a href="/tajweed-ul-quran-grade-1-qaida.pdf" download="darussalam-qurani-qaida-grade-1.pdf" className="gap-1.5">
                    <Download className="size-3.5" /> Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tafheem ud Din Grade 1 Coursebook */}
          <Card className="card-soft border-primary/40 bg-card shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="default" className="bg-primary text-primary-foreground">Grade 1 • تفہیم الدین</Badge>
                  <span className="text-xs text-muted-foreground font-mono">PDF (2.4 MB)</span>
                </div>
                <CardTitle className="text-lg font-bold mt-2">Tafheem ud Din Coursebook</CardTitle>
                <p className="urdu text-base text-primary">تفہیم الدین — درجہ اولیٰ درسی کتاب</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Official course manual for Grade 1 students of Ma'had al-Uloom (Tauheed Trust). Foundations of Islamic belief, understanding, and daily practice.
                </p>
              </CardContent>
            </div>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                <Button asChild variant="gold" size="sm" className="font-semibold text-xs h-8">
                  <a href={tafheemPdf.url} target="_blank" rel="noreferrer" className="gap-1.5">
                    <FileText className="size-3.5" /> Open / کھولیں
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-xs h-8">
                  <a href={tafheemPdf.url} download="tafheem-ud-din-grade-1.pdf" className="gap-1.5">
                    <Download className="size-3.5" /> Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usool e Hadith Grade 1 Coursebook */}
          <Card className="card-soft border-emerald-500/40 bg-card shadow-sm flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="default" className="bg-emerald-600 text-white font-semibold">Grade 1 • اصول حدیث</Badge>
                  <span className="text-xs text-muted-foreground font-mono">PDF (8.0 MB)</span>
                </div>
                <CardTitle className="text-lg font-bold mt-2">Usool e Hadith Coursebook</CardTitle>
                <p className="urdu text-base text-primary">اصول حدیث — الدرجة الأولی نصابی کتاب</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete manual of Hadith Sciences for Grade 1: Sanad &amp; Matn, Mutawatir &amp; Wahid, Sahih, Hasan, Dhaeef, Inqita', and Jarh wat-Ta'deel.
                </p>
              </CardContent>
            </div>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                <Button asChild variant="gold" size="sm" className="font-semibold text-xs h-8">
                  <a href="/usool-e-hadith-grade-1.pdf" target="_blank" rel="noreferrer" className="gap-1.5">
                    <FileText className="size-3.5" /> Open / کھولیں
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-xs h-8">
                  <a href="/usool-e-hadith-grade-1.pdf" download="usool-e-hadith-grade-1.pdf" className="gap-1.5">
                    <Download className="size-3.5" /> Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exam Results Banner */}
        <Card className="card-soft border-gold/40 bg-gradient-to-r from-primary/10 via-card to-gold/10">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gold">
                <Award className="size-5" />
                <span className="font-bold text-sm">Exam Results / امتحانی نتائج</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">Grade 1 Midterm Examination Results</h3>
              <p className="urdu text-sm text-muted-foreground">الدرجۃ الاولیٰ (ملیر زون) ششماہی امتحانی نتائج جاری کر دیے گئے ہیں۔</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Button asChild variant="gold" className="font-semibold shadow">
                <Link to="/results">View Marksheet / نتائج دیکھیں →</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="/results-grade-1-midterm.pdf" target="_blank" rel="noreferrer" className="gap-1.5">
                  <FileText className="size-4" /> Official PDF
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <CategoryPage
          category="resource"
          titleEn="Additional Material"
          titleUr="اضافی مواد"
          intro="Supplementary study notes, worksheets, and publications uploaded by instructors."
        />
      </div>
    </SiteLayout>
  );
}
