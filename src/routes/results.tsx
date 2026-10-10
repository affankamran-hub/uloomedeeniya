import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Award,
  Search,
  Download,
  FileText,
  GraduationCap,
  Trophy,
  Filter,
  CheckCircle2,
  Users,
  Percent,
  Pencil,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/useAuth";
import { useSetting } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Examination Results | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content:
          "Official examination results for Grade 1 (Malir Zone) students of Uloom e Deeniya, Ma'had al-Uloom (Tauheed Trust, Karachi).",
      },
      { property: "og:title", content: "Exam Results | Uloom e Deeniya" },
      {
        property: "og:description",
        content: "Grade 1 Malir Zone Midterm Examination Marksheet and student performance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

type StudentResult = {
  rollNo: number;
  name: string;
  fatherName: string;
  area: string;
  tarjuma: number;
  lughah: number;
  tafheem: number;
  tajweed: number;
  hadith: number;
  total: number;
  percentage: number;
  grade: "ممتاز" | "جید جداً" | "جید" | "مقبول" | "ضعیف" | "راسب";
  failedSubjects?: string[];
};

const RESULTS_DATA: StudentResult[] = [
  { rollNo: 1, name: "محمد امین", fatherName: "رضا خان", area: "لیر کالونی", hadith: 49, tajweed: 46, tafheem: 35.5, lughah: 49, tarjuma: 46, total: 225.5, percentage: 90.2, grade: "ممتاز" },
  { rollNo: 2, name: "حنظلہ امین", fatherName: "محمد امین", area: "لیر کالونی", hadith: 20, tajweed: 23, tafheem: 18, lughah: 44, tarjuma: 36, total: 141.0, percentage: 56.4, grade: "ضعیف", failedSubjects: ["ترجمہ", "تفہیم"] },
  { rollNo: 3, name: "رضوان اللہ", fatherName: "زادہ خان", area: "لیر کالونی", hadith: 9, tajweed: 22, tafheem: 19, lughah: 43, tarjuma: 29, total: 122.0, percentage: 48.8, grade: "راسب", failedSubjects: ["ترجمہ"] },
  { rollNo: 4, name: "محمد انس", fatherName: "عبدالقیوم", area: "لیر کالونی", hadith: 27, tajweed: 42, tafheem: 14.5, lughah: 49, tarjuma: 29, total: 161.5, percentage: 64.6, grade: "مقبول" },
  { rollNo: 5, name: "محمد یوسف", fatherName: "رضوان احمد", area: "لیر کالونی", hadith: 19, tajweed: 12, tafheem: 5, lughah: 33, tarjuma: 30, total: 99.0, percentage: 39.6, grade: "راسب", failedSubjects: ["ترجمہ", "دروس اللغۃ", "تفہیم"] },
  { rollNo: 6, name: "شعیب خان", fatherName: "زبیر احمد", area: "لیر کالونی", hadith: 0, tajweed: 0, tafheem: 0, lughah: 0, tarjuma: 0, total: 0.0, percentage: 0.0, grade: "راسب" },
  { rollNo: 7, name: "نعمان وحید", fatherName: "وحید خان", area: "لیر کالونی", hadith: 0, tajweed: 0, tafheem: 0, lughah: 0, tarjuma: 0, total: 0.0, percentage: 0.0, grade: "راسب" },
  { rollNo: 8, name: "سعد بن یامین", fatherName: "بن یامین", area: "لیر کالونی", hadith: 35, tajweed: 39, tafheem: 33.5, lughah: 47, tarjuma: 39, total: 193.5, percentage: 77.4, grade: "جید" },
  { rollNo: 9, name: "عبد السمیع", fatherName: "سعید احمد", area: "لیر کالونی", hadith: 32, tajweed: 20, tafheem: 12, lughah: 48, tarjuma: 26, total: 138.0, percentage: 55.2, grade: "راسب", failedSubjects: ["دروس اللغۃ", "تفہیم"] },
  { rollNo: 10, name: "اسامہ شفیع", fatherName: "محمد شفیع", area: "لیر کالونی", hadith: 0, tajweed: 0, tafheem: 0, lughah: 0, tarjuma: 0, total: 0.0, percentage: 0.0, grade: "راسب" },
  { rollNo: 11, name: "محمد یوسف", fatherName: "انس محمود", area: "لیر کالونی", hadith: 13, tajweed: 13, tafheem: 26, lughah: 34, tarjuma: 30, total: 116.0, percentage: 46.4, grade: "راسب", failedSubjects: ["ترجمہ", "دروس اللغۃ"] },
  { rollNo: 12, name: "احمد", fatherName: "عبدالمجید", area: "کھوکھراپار", hadith: 40, tajweed: 45, tafheem: 34.5, lughah: 50, tarjuma: 40, total: 209.5, percentage: 83.8, grade: "جید جداً" },
  { rollNo: 13, name: "محمد احمد", fatherName: "محمد اختر", area: "محمود آباد", hadith: 41, tajweed: 31, tafheem: 38, lughah: 49, tarjuma: 39, total: 198.0, percentage: 79.2, grade: "جید" },
  { rollNo: 14, name: "عثمان احمد", fatherName: "علی محمد", area: "محمود آباد", hadith: 42, tajweed: 21, tafheem: 36, lughah: 45, tarjuma: 40, total: 184.0, percentage: 73.6, grade: "جید" },
  { rollNo: 15, name: "اسحاق عبدالمؤمن", fatherName: "بشیر عبداللہ", area: "رفاہ عام", hadith: 36, tajweed: 32, tafheem: 31, lughah: 46, tarjuma: 27, total: 172.0, percentage: 68.8, grade: "مقبول" },
  { rollNo: 16, name: "لقمان عبدالحکیم", fatherName: "بشیر عبداللہ", area: "رفاہ عام", hadith: 34, tajweed: 40, tafheem: 17, lughah: 43, tarjuma: 21, total: 155.0, percentage: 62.0, grade: "مقبول", failedSubjects: ["تفہیم"] },
  { rollNo: 17, name: "صفدر آصف", fatherName: "آصف علی", area: "رفاہ عام", hadith: 15, tajweed: 9, tafheem: 26, lughah: 39, tarjuma: 18, total: 107.0, percentage: 42.8, grade: "راسب", failedSubjects: ["ترجمہ", "دروس اللغۃ"] },
  { rollNo: 18, name: "یعیش بن ندیم", fatherName: "ندیم اتمامیہ", area: "رفاہ عام", hadith: 15, tajweed: 11, tafheem: 21, lughah: 39, tarjuma: 2, total: 88.0, percentage: 35.2, grade: "راسب", failedSubjects: ["ترجمہ", "دروس اللغۃ", "حدیث"] },
  { rollNo: 19, name: "عفان کامران", fatherName: "کامران مسعود", area: "رفاہ عام", hadith: 41, tajweed: 50, tafheem: 45, lughah: 47, tarjuma: 49, total: 232.0, percentage: 92.8, grade: "ممتاز" },
  { rollNo: 20, name: "عثمان کامران", fatherName: "کامران مسعود", area: "رفاہ عام", hadith: 25, tajweed: 42, tafheem: 42, lughah: 44, tarjuma: 47, total: 200.0, percentage: 80.0, grade: "جید" },
  { rollNo: 21, name: "معاویہ راشد", fatherName: "راشد جمال", area: "رفاہ عام", hadith: 46, tajweed: 49, tafheem: 49, lughah: 47, total: 241.0, tarjuma: 50, percentage: 96.4, grade: "ممتاز" },
  { rollNo: 22, name: "عبدالرحمٰن", fatherName: "عارف", area: "رفاہ عام", hadith: 47, tajweed: 21, tafheem: 39, lughah: 33, tarjuma: 47, total: 187.0, percentage: 74.8, grade: "جید" },
  { rollNo: 23, name: "اسحان زبیر", fatherName: "زبیر", area: "رفاہ عام", hadith: 13, tajweed: 10, tafheem: 16, lughah: 37, tarjuma: 7, total: 83.0, percentage: 33.2, grade: "راسب", failedSubjects: ["ترجمہ", "دروس اللغۃ", "تفہیم", "حدیث"] },
  { rollNo: 24, name: "عارف بیگ", fatherName: "عبدالعظیم بیگ", area: "رفاہ عام", hadith: 37, tajweed: 30, tafheem: 34.5, lughah: 42, tarjuma: 25, total: 168.5, percentage: 67.4, grade: "مقبول" },
  { rollNo: 25, name: "عبدالرحمٰن بیگ", fatherName: "عارف بیگ", area: "رفاہ عام", hadith: 23, tajweed: 22, tafheem: 22.5, lughah: 39, tarjuma: 21, total: 127.5, percentage: 51.0, grade: "ضعیف" },
  { rollNo: 26, name: "ابراہیم خالد", fatherName: "خالد عزیز", area: "رفاہ عام", hadith: 41, tajweed: 44, tafheem: 47, lughah: 50, tarjuma: 50, total: 232.0, percentage: 92.8, grade: "ممتاز" },
  { rollNo: 27, name: "عمار عاصم", fatherName: "عاصم احسان", area: "رفاہ عام", hadith: 17, tajweed: 28, tafheem: 31.5, lughah: 31, tarjuma: 15, total: 122.5, percentage: 49.0, grade: "راسب", failedSubjects: ["ترجمہ", "حدیث"] },
];

function ResultsPage() {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const { isAdmin } = useAuth();
  const { value: nameFixes, save: saveNames } = useSetting<Record<string, { name: string; fatherName: string }>>("result_names", {});
  const [editRoll, setEditRoll] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editFather, setEditFather] = useState("");
  const DATA = useMemo(
    () => RESULTS_DATA.map((s) => ({ ...s, ...(nameFixes[String(s.rollNo)] ?? {}) })),
    [nameFixes],
  );

  const filteredResults = useMemo(() => {
    return DATA.filter((s) => {
      if (selectedGrade !== "all" && s.grade !== selectedGrade) return false;
      if (selectedArea !== "all" && s.area !== selectedArea) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        s.name.includes(q) ||
        s.fatherName.includes(q) ||
        String(s.rollNo).includes(q) ||
        s.area.includes(q)
      );
    });
  }, [DATA, search, selectedGrade, selectedArea]);

  const topStudents = useMemo(() => {
    return [...DATA].sort((a, b) => b.total - a.total).slice(0, 3);
  }, [DATA]);

  const getBadgeVariant = (grade: StudentResult["grade"]) => {
    switch (grade) {
      case "ممتاز":
        return "bg-amber-500 text-slate-950 font-bold";
      case "جید جداً":
        return "bg-emerald-600 text-white font-semibold";
      case "جید":
        return "bg-blue-600 text-white";
      case "مقبول":
        return "bg-teal-600 text-white";
      case "ضعیف":
        return "bg-yellow-600 text-white";
      case "راسب":
        return "bg-red-600 text-white";
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        {/* Header section */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1">
              <Award className="size-3.5" /> Examination Results / امتحانی نتائج
            </div>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Grade 1 Midterm Exam Results
            </h1>
            <p className="urdu text-2xl text-primary font-medium">
              الدرجۃ الاولیٰ (ملیر زون) — ششماہی امتحان نتائج
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Ma'had al-Uloom (Tauheed Trust, Karachi) • Maximum Total: 250 Marks (5 Subjects)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="gold" className="font-semibold shadow">
              <a href="/results-grade-1-midterm.pdf" target="_blank" rel="noreferrer" className="gap-2">
                <FileText className="size-4" /> View Official PDF / اصل رزلٹ شیٹ
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/results-grade-1-midterm.pdf" download="uloom-e-deeniya-grade-1-results.pdf" className="gap-2">
                <Download className="size-4" /> Download PDF
              </a>
            </Button>
          </div>
        </div>

        {/* Top 3 High Achievers Card */}
        <div className="grid gap-4 sm:grid-cols-3">
          {topStudents.map((student, i) => (
            <Card key={student.rollNo} className="card-soft relative overflow-hidden border-gold/40 bg-card shadow-sm">
              <div className="absolute top-0 right-0 bg-gold text-slate-950 font-bold px-3 py-1 text-xs rounded-bl-lg">
                Position #{i + 1}
              </div>
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center gap-2 text-gold">
                  <Trophy className="size-5" />
                  <span className="text-xs font-semibold">پوزیشن {i + 1}</span>
                </div>
                <CardTitle className="text-lg font-bold mt-1">
                  {student.name} <span className="text-xs font-normal text-muted-foreground">ولد {student.fatherName}</span>
                </CardTitle>
                <p className="urdu text-xs text-primary">{student.area}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm pt-2 border-t border-border/60">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-muted-foreground text-xs">Total Obtained:</span>
                  <span className="font-bold text-foreground">{student.total} / 250</span>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-muted-foreground text-xs">Percentage:</span>
                  <span className="font-bold text-gold">{student.percentage}%</span>
                </div>
                <Badge className={`w-fit mt-1 text-xs ${getBadgeVariant(student.grade)}`}>
                  {student.grade}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <Card className="card-soft">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search student name, father name, or roll no…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Grade Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades / تمام</SelectItem>
                    <SelectItem value="ممتاز">ممتاز (Distinction)</SelectItem>
                    <SelectItem value="جید جداً">جید جداً (Very Good)</SelectItem>
                    <SelectItem value="جید">جید (Good)</SelectItem>
                    <SelectItem value="مقبول">مقبول (Passed)</SelectItem>
                    <SelectItem value="ضعیف">ضعیف (Weak)</SelectItem>
                    <SelectItem value="راسب">راسب (Failed)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Area / علاقہ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas / تمام</SelectItem>
                    <SelectItem value="رفاہ عام">رفاہ عام</SelectItem>
                    <SelectItem value="لیر کالونی">لیر کالونی</SelectItem>
                    <SelectItem value="محمود آباد">محمود آباد</SelectItem>
                    <SelectItem value="کھوکھراپار">کھوکھراپار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
              <span>Showing <strong>{filteredResults.length}</strong> of 27 students</span>
              <span className="urdu">علوم دینیہ — ششماہی امتحانی ریکارڈ</span>
            </div>
          </CardContent>
        </Card>

        {/* Results Data Table */}
        <Card className="card-soft overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="text-center font-bold text-xs">
                  <TableHead className="w-12 text-center">Roll #</TableHead>
                  <TableHead className="text-right min-w-44">نام طالب علم / Name</TableHead>
                  <TableHead className="text-right min-w-36">ولدیت / Father</TableHead>
                  <TableHead className="text-center">علاقہ / Area</TableHead>
                  <TableHead className="text-center">اصول حدیث (50)</TableHead>
                  <TableHead className="text-center">تجوید القرآن (50)</TableHead>
                  <TableHead className="text-center">تفہیم الدین (50)</TableHead>
                  <TableHead className="text-center">دروس اللغۃ (50)</TableHead>
                  <TableHead className="text-center">ترجمہ القرآن (50)</TableHead>
                  <TableHead className="text-center font-bold">کل نمبر (250)</TableHead>
                  <TableHead className="text-center font-bold">فیصد %</TableHead>
                  <TableHead className="text-center">کیفیت / Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((s) => (
                  <TableRow key={s.rollNo} className="text-center hover:bg-muted/40 transition-colors">
                    <TableCell className="font-mono font-bold text-xs">{s.rollNo}</TableCell>
                    {editRoll === s.rollNo ? (
                      <>
                        <TableCell><Input dir="rtl" className="urdu h-8" value={editName} onChange={(e) => setEditName(e.target.value)} /></TableCell>
                        <TableCell>
                          <Input dir="rtl" className="urdu h-8" value={editFather} onChange={(e) => setEditFather(e.target.value)} />
                          <div className="mt-1 flex gap-1">
                            <Button size="sm" className="h-7 text-xs" onClick={async () => {
                              if (await saveNames({ ...nameFixes, [String(s.rollNo)]: { name: editName.trim(), fatherName: editFather.trim() } })) setEditRoll(null);
                            }}>Save</Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditRoll(null)}>Cancel</Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-right font-medium">
                          <span className="urdu text-base">{s.name}</span>
                          {isAdmin && (
                            <button type="button" aria-label="Edit name" className="mr-2 text-primary" onClick={() => { setEditRoll(s.rollNo); setEditName(s.name); setEditFather(s.fatherName); }}>
                              <Pencil className="inline size-3.5" />
                            </button>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          <span className="urdu text-sm">{s.fatherName}</span>
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <Badge variant="outline" className="urdu text-xs">{s.area}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{s.hadith}</TableCell>
                    <TableCell className="font-mono text-xs">{s.tajweed}</TableCell>
                    <TableCell className="font-mono text-xs">{s.tafheem}</TableCell>
                    <TableCell className="font-mono text-xs">{s.lughah}</TableCell>
                    <TableCell className="font-mono text-xs">{s.tarjuma}</TableCell>
                    <TableCell className="font-mono font-bold text-sm text-foreground">{s.total}</TableCell>
                    <TableCell className="font-mono font-semibold text-xs text-primary">{s.percentage}%</TableCell>
                    <TableCell>
                      <Badge className={`text-xs px-2 py-0.5 ${getBadgeVariant(s.grade)}`}>
                        {s.grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Grading Scheme Reference */}
        <Card className="card-soft bg-muted/20">
          <CardContent className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Grading Criteria / امتحانی معیار
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-2 text-center text-xs">
              <div className="p-2 rounded bg-amber-500/15 border border-amber-500/40">
                <p className="font-bold text-amber-600 dark:text-amber-400">ممتاز (Distinction)</p>
                <p className="text-[11px] text-muted-foreground">90% and above</p>
              </div>
              <div className="p-2 rounded bg-emerald-500/15 border border-emerald-500/40">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">جید جداً (First Class)</p>
                <p className="text-[11px] text-muted-foreground">80% to 89.9%</p>
              </div>
              <div className="p-2 rounded bg-blue-500/15 border border-blue-500/40">
                <p className="font-bold text-blue-600 dark:text-blue-400">جید (Second Class)</p>
                <p className="text-[11px] text-muted-foreground">70% to 79.9%</p>
              </div>
              <div className="p-2 rounded bg-teal-500/15 border border-teal-500/40">
                <p className="font-bold text-teal-600 dark:text-teal-400">مقبول (Pass)</p>
                <p className="text-[11px] text-muted-foreground">60% to 69.9%</p>
              </div>
              <div className="p-2 rounded bg-yellow-500/15 border border-yellow-500/40">
                <p className="font-bold text-yellow-600 dark:text-yellow-400">ضعیف (Below Average)</p>
                <p className="text-[11px] text-muted-foreground">50% to 59.9%</p>
              </div>
              <div className="p-2 rounded bg-red-500/15 border border-red-500/40">
                <p className="font-bold text-red-600 dark:text-red-400">راسب (Fail)</p>
                <p className="text-[11px] text-muted-foreground">Below 50%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
