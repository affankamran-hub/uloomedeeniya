import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Trophy, Gift, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/useAuth";
import { GRADES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content: "Points earned by students of Uloom e Deeniya in quizzes, tests and assignments.",
      },
      { property: "og:title", content: "Leaderboard | Uloom e Deeniya" },
      { property: "og:description", content: "See which students are leading in quizzes and tests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardPage,
});

type Row = {
  user_id: string;
  full_name: string | null;
  requested_grade: number | null;
  points: number;
  attempts: number;
};

function LeaderboardPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    enabled: !!user,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("leaderboard");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter(
      (r) =>
        (grade === "all" || String(r.requested_grade ?? "") === grade) &&
        (!term || (r.full_name ?? "").toLowerCase().includes(term)),
    );
  }, [data, search, grade]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Trophy className="size-8 text-gold" /> Leaderboard / لیڈر بورڈ
        </h1>
        <p className="urdu text-xl text-primary mt-1">امتحانی و تعلیمی پوائنٹس کی درجہ بندی</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Points accumulated from active quizzes, tests, and homework assignments answered by students.
        </p>

        {/* Special Owner Treat Announcement Banner */}
        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-gold bg-gradient-to-br from-gold/25 via-amber-500/15 to-primary/10 p-6 shadow-xl ring-2 ring-gold/40 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gold text-slate-950 shadow-lg">
                <Gift className="size-8 animate-bounce" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/30 px-3.5 py-0.5 text-xs font-black text-slate-950 dark:text-gold uppercase tracking-wider">
                  <Sparkles className="size-3.5" /> Special Prize Announcement / خصوصی انعام
                </div>
                <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                  “Whoever remains at the top of the leaderboard will win a treat from the owner of the website!”
                </h2>
                <p className="urdu text-xl md:text-2xl font-bold text-primary leading-relaxed">
                  ”جو طالبِ علم لیڈر بورڈ میں سب سے اوپر (پہلی پوزیشن پر) رہے گا، اسے ویب سائٹ کے مالک کی جانب سے خصوصی دعوت (Treat) دی جائے گی!“
                </p>
              </div>
            </div>
            <Badge className="shrink-0 bg-gold px-4 py-2.5 text-xs md:text-sm font-black text-slate-950 shadow-md">
              🏆 #1 Champion Treat
            </Badge>
          </div>
        </div>

        {!user ? (
          <div className="mt-8">
            <Button asChild>
              <Link to="/auth">Sign in to see the leaderboard</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Search student / نام تلاش کریں"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="sm:max-w-xs"
              />
              <Select
                value={grade}
                onValueChange={(v) => {
                  setGrade(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="sm:w-56">
                  <SelectValue placeholder="All grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All grades / تمام درجات</SelectItem>
                  {GRADES.map((g) => (
                    <SelectItem key={g.n} value={String(g.n)}>
                      {g.en} — {g.ur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filtered.length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No attempts recorded yet. <span className="urdu">ابھی کوئی کوشش درج نہیں۔</span>
          </p>
        ) : (
              <div className="mt-6 space-y-2">
                {rows.map((row, i) => (
              <Card key={row.user_id} className="card-soft">
                <CardContent className="flex items-center gap-4 py-4">
                      <span className="w-8 font-display text-xl text-gold">
                        {(current - 1) * pageSize + i + 1}
                      </span>
                  <div>
                    <p className="font-medium">{row.full_name || "Student"}</p>
                    {row.requested_grade && (
                      <p className="urdu text-xs text-muted-foreground">
                        {GRADES.find((g) => g.n === row.requested_grade)?.ur}
                      </p>
                    )}
                  </div>
                  <div className="ms-auto flex items-center gap-2">
                    <Badge variant="outline">{row.attempts} attempts</Badge>
                    <Badge>{row.points} points</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      disabled={current <= 1}
                      onClick={() => setPage(current - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {current} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={current >= totalPages}
                      onClick={() => setPage(current + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
          </div>
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}