import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { GRADES, subjectName } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type QuizRow = {
  id: string;
  kind: string;
  title: string;
  title_ur: string | null;
  description: string | null;
  grade: number | null;
  subject: string | null;
  points_per_question: number;
  is_published: boolean;
};

type QuestionRow = {
  id: string;
  prompt: string;
  prompt_ur: string | null;
  options: unknown;
  sort_order: number;
};

export function useQuizzes(kind?: string) {
  return useQuery({
    queryKey: ["quizzes", kind ?? "all"],
    queryFn: async () => {
      let q = supabase.from("quizzes").select("*").order("created_at", { ascending: false });
      if (kind) q = q.eq("kind", kind);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as QuizRow[];
    },
  });
}

function QuizRunner({ quiz, onDone }: { quiz: QuizRow; onDone: () => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["quiz-questions", quiz.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("take_quiz", { _quiz_id: quiz.id });
      if (error) throw error;
      return (data ?? []) as unknown as QuestionRow[];
    },
  });

  const submit = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("submit_quiz", {
      _quiz_id: quiz.id,
      _answers: answers,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const row = (data as unknown as { score: number; total: number }[])?.[0];
    setResult(row ?? { score: 0, total: 0 });
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    toast.success("Answers submitted");
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading questions…</p>;
  const questions = data ?? [];
  if (questions.length === 0)
    return <p className="text-sm text-muted-foreground">No questions have been added yet.</p>;

  if (result) {
    return (
      <div className="space-y-4">
        <p className="text-lg">
          Score: <span className="font-semibold text-primary">{result.score}</span> / {result.total}
        </p>
        <p className="urdu text-sm text-muted-foreground">آپ کا نتیجہ محفوظ کر لیا گیا ہے۔</p>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/leaderboard">See leaderboard</Link>
          </Button>
          <Button onClick={onDone}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, index) => {
        const options = Array.isArray(q.options) ? (q.options as string[]) : [];
        return (
          <div key={q.id} className="space-y-3">
            <p className="font-medium">
              {index + 1}. {q.prompt}
            </p>
            {q.prompt_ur && <p className="urdu text-sm text-muted-foreground">{q.prompt_ur}</p>}
            <RadioGroup
              value={answers[q.id] !== undefined ? String(answers[q.id]) : ""}
              onValueChange={(v) => setAnswers({ ...answers, [q.id]: Number(v) })}
            >
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <RadioGroupItem value={String(i)} id={`${q.id}-${i}`} />
                  <Label htmlFor={`${q.id}-${i}`} className="font-normal">
                    {opt}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      })}
      <div className="flex gap-2">
        <Button onClick={submit} disabled={busy}>
          {busy ? "Submitting…" : "Submit answers"}
        </Button>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function QuizList({
  kind,
  titleEn,
  titleUr,
  intro,
}: {
  kind: string;
  titleEn: string;
  titleUr: string;
  intro: string;
}) {
  const { user, profile, isAdmin, isTeacher } = useAuth();
  const { data, isLoading } = useQuizzes(kind);
  const [activeQuiz, setActiveQuiz] = useState<QuizRow | null>(null);
  const qc = useQueryClient();

  const allowed = isAdmin || isTeacher || !!profile?.approved;

  if (activeQuiz) {
    return (
      <Card className="card-soft">
        <CardHeader>
          <CardTitle>{activeQuiz.title}</CardTitle>
          {activeQuiz.title_ur && <p className="urdu text-base text-primary">{activeQuiz.title_ur}</p>}
        </CardHeader>
        <CardContent>
          <QuizRunner
            quiz={activeQuiz}
            onDone={() => {
              setActiveQuiz(null);
              qc.invalidateQueries({ queryKey: ["leaderboard"] });
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{titleEn}</h1>
      <p className="urdu text-xl text-primary font-medium">{titleUr}</p>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>

      {/* Special Owner Surprise Treat Incentive */}
      <div className="mt-6 rounded-2xl border-2 border-gold bg-gradient-to-r from-gold/20 via-amber-500/15 to-primary/10 p-4 md:p-5 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold text-slate-950 shadow">
              <Gift className="size-6 animate-bounce" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-950 dark:text-gold">
                🏆 Leaderboard Challenge / خصوصی انعام
              </p>
              <p className="text-sm font-bold text-foreground">
                “Whoever remains at the top of the leaderboard will win a surprise treat from the owner of the website!”
              </p>
              <p className="urdu text-sm font-bold text-primary">
                ”جو طالبِ علم ویب سائٹ کے لیڈر بورڈ میں پہلی پوزیشن پر رہے گا، اسے ویب سائٹ کے مالک کی جانب سے سرپرائز دعوت (Surprise Treat) دی جائے گی!“
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="gold" className="shrink-0 font-bold shadow text-xs">
            <Link to="/leaderboard">Leaderboard →</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && (data ?? []).length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground md:col-span-2">
            Nothing published here yet. <span className="urdu">ابھی کچھ شائع نہیں ہوا۔</span>
          </p>
        )}
        {(data ?? []).map((quiz) => (
          <Card key={quiz.id} className="card-soft">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap gap-2">
                {quiz.grade && (
                  <Badge variant="secondary">{GRADES.find((g) => g.n === quiz.grade)?.en}</Badge>
                )}
                {subjectName(quiz.subject) && (
                  <Badge variant="outline">{subjectName(quiz.subject)!.en}</Badge>
                )}
              </div>
              <CardTitle className="mt-2 text-lg">{quiz.title}</CardTitle>
              {quiz.title_ur && <p className="urdu text-base text-muted-foreground">{quiz.title_ur}</p>}
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {quiz.description && <p>{quiz.description}</p>}
              {allowed ? (
                <Button onClick={() => setActiveQuiz(quiz)}>Start</Button>
              ) : (
                <p>
                  {user
                    ? "Awaiting administrator approval. / منظوری کا انتظار ہے۔"
                    : "Sign in and get approved to take part."}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}