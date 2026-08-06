import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/useAuth";
import { GRADES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("leaderboard");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="flex items-center gap-3 text-3xl">
          <Trophy className="size-7 text-gold" /> Leaderboard
        </h1>
        <p className="urdu text-xl text-primary">نتائج کی فہرست</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Points from quizzes, tests and assignments answered on the website.
        </p>

        {!user ? (
          <div className="mt-8">
            <Button asChild>
              <Link to="/auth">Sign in to see the leaderboard</Link>
            </Button>
          </div>
        ) : isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
        ) : (data ?? []).length === 0 ? (
          <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No attempts recorded yet. <span className="urdu">ابھی کوئی کوشش درج نہیں۔</span>
          </p>
        ) : (
          <div className="mt-8 space-y-2">
            {(data ?? []).map((row, i) => (
              <Card key={row.user_id} className="card-soft">
                <CardContent className="flex items-center gap-4 py-4">
                  <span className="w-8 font-display text-xl text-gold">{i + 1}</span>
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
          </div>
        )}
      </div>
    </SiteLayout>
  );
}