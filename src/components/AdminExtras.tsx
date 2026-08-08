import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAnnouncements } from "@/components/UpdatesDrawer";
import { useQuizzes } from "@/components/QuizSection";
import { GRADES, SUBJECTS } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UpdatesTab() {
  const qc = useQueryClient();
  const { data } = useAnnouncements();
  const [form, setForm] = useState({ title: "", title_ur: "", body: "", body_ur: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("announcements").insert({
      title: form.title,
      title_ur: form.title_ur || null,
      body: form.body,
      body_ur: form.body_ur || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Update posted");
    setForm({ title: "", title_ur: "", body: "", body_ur: "" });
    qc.invalidateQueries({ queryKey: ["announcements"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["announcements"] });
  };

  const togglePin = async (id: string, pinned: boolean) => {
    const { error } = await supabase.from("announcements").update({ pinned }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["announcements"] });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <Card className="card-soft h-fit">
        <CardHeader>
          <CardTitle>Write an update</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Title (اردو)</Label>
              <Input className="urdu" value={form.title_ur} onChange={(e) => setForm({ ...form, title_ur: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Text (English)</Label>
              <Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Text (اردو)</Label>
              <Textarea className="urdu" value={form.body_ur} onChange={(e) => setForm({ ...form, body_ur: e.target.value })} />
            </div>
            <Button type="submit" className="w-full">Post update</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(data ?? []).map((a) => (
          <Card key={a.id} className="card-soft">
            <CardContent className="flex flex-wrap items-center gap-3 py-4">
              {a.pinned && <Badge variant="secondary">Pinned</Badge>}
              <div>
                <p className="font-medium">{a.title}</p>
                {a.title_ur && <p className="urdu text-sm text-muted-foreground">{a.title_ur}</p>}
              </div>
              <div className="ms-auto flex gap-2">
                <Button size="sm" variant="outline" onClick={() => togglePin(a.id, !a.pinned)}>
                  {a.pinned ? "Unpin" : "Pin"}
                </Button>
                <Button size="icon" variant="outline" onClick={() => remove(a.id)} aria-label="Delete">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

type AdminQuestion = {
  id: string;
  prompt: string;
  prompt_ur: string | null;
  options: unknown;
  correct_index: number;
  sort_order: number;
};

function QuestionManager({ quizId }: { quizId: string }) {
  const qc = useQueryClient();
  const key = ["admin-questions", quizId];
  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("sort_order")
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as unknown as AdminQuestion[];
    },
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ prompt: "", prompt_ur: "", options: "", correct: "1" });

  const startEdit = (q: AdminQuestion) => {
    setEditing(q.id);
    setDraft({
      prompt: q.prompt,
      prompt_ur: q.prompt_ur ?? "",
      options: (Array.isArray(q.options) ? (q.options as string[]) : []).join("\n"),
      correct: String(q.correct_index + 1),
    });
  };

  const save = async (id: string) => {
    const options = draft.options.split("\n").map((o) => o.trim()).filter(Boolean);
    if (options.length < 2) { toast.error("Add at least two options, one per line"); return; }
    const correctIndex = Number(draft.correct) - 1;
    if (correctIndex < 0 || correctIndex >= options.length) { toast.error("Correct option number is out of range"); return; }
    const { error } = await supabase
      .from("quiz_questions")
      .update({
        prompt: draft.prompt,
        prompt_ur: draft.prompt_ur || null,
        options,
        correct_index: correctIndex,
      })
      .eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Question updated");
    setEditing(null);
    qc.invalidateQueries({ queryKey: key });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: key });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading questions…</p>;
  const questions = data ?? [];
  if (questions.length === 0)
    return <p className="text-sm text-muted-foreground">No MCQs yet — add one above.</p>;

  return (
    <div className="space-y-3">
      {questions.map((q, i) => {
        const options = Array.isArray(q.options) ? (q.options as string[]) : [];
        if (editing === q.id) {
          return (
            <div key={q.id} className="space-y-3 rounded-lg border border-border p-4">
              <div className="space-y-2">
                <Label>Question (English)</Label>
                <Input value={draft.prompt} onChange={(e) => setDraft({ ...draft, prompt: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Question (اردو)</Label>
                <Input className="urdu" value={draft.prompt_ur} onChange={(e) => setDraft({ ...draft, prompt_ur: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Options — one per line</Label>
                <Textarea rows={4} value={draft.options} onChange={(e) => setDraft({ ...draft, options: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Correct option number</Label>
                <Input type="number" min={1} value={draft.correct} onChange={(e) => setDraft({ ...draft, correct: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => save(q.id)}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </div>
          );
        }
        return (
          <div key={q.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{i + 1}. {q.prompt}</p>
                {q.prompt_ur && <p className="urdu text-sm text-muted-foreground">{q.prompt_ur}</p>}
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {options.map((o, oi) => (
                    <li key={oi} className={oi === q.correct_index ? "font-medium text-primary" : ""}>
                      {String.fromCharCode(65 + oi)}. {o}
                      {oi === q.correct_index && " ✓"}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(q)}>Edit</Button>
                <Button size="icon" variant="outline" onClick={() => remove(q.id)} aria-label="Delete question">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function QuizzesTab() {
  const qc = useQueryClient();
  const { data } = useQuizzes();
  const [quiz, setQuiz] = useState({
    kind: "quiz",
    title: "",
    title_ur: "",
    description: "",
    grade: "1",
    subject: "tafheem",
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [question, setQuestion] = useState({
    prompt: "",
    prompt_ur: "",
    options: "",
    correct: "1",
  });

  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: row, error } = await supabase
      .from("quizzes")
      .insert({
        kind: quiz.kind,
        title: quiz.title,
        title_ur: quiz.title_ur || null,
        description: quiz.description || null,
        grade: Number(quiz.grade),
        subject: quiz.subject,
      })
      .select("id")
      .single();
    if (error) { toast.error(error.message); return; }
    toast.success("Created — now add questions");
    setActiveId((row as { id: string }).id);
    setQuiz({ ...quiz, title: "", title_ur: "", description: "" });
    qc.invalidateQueries({ queryKey: ["quizzes"] });
  };

  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId) return;
    const options = question.options.split("\n").map((o) => o.trim()).filter(Boolean);
    if (options.length < 2) { toast.error("Add at least two options, one per line"); return; }
    const correctIndex = Number(question.correct) - 1;
    if (correctIndex < 0 || correctIndex >= options.length) { toast.error("Correct option number is out of range"); return; }
    const { error } = await supabase.from("quiz_questions").insert({
      quiz_id: activeId,
      prompt: question.prompt,
      prompt_ur: question.prompt_ur || null,
      options,
      correct_index: correctIndex,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Question added");
    setQuestion({ prompt: "", prompt_ur: "", options: "", correct: "1" });
    qc.invalidateQueries({ queryKey: ["admin-questions", activeId] });
  };

  const removeQuiz = async (id: string) => {
    if (!window.confirm("Delete this item and all its questions?")) return;
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    if (activeId === id) setActiveId(null);
    qc.invalidateQueries({ queryKey: ["quizzes"] });
  };

  const togglePublish = async (id: string, is_published: boolean) => {
    const { error } = await supabase.from("quizzes").update({ is_published }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["quizzes"] });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <Card className="card-soft">
          <CardHeader><CardTitle>New quiz / test / assignment</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={createQuiz} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={quiz.kind} onValueChange={(v) => setQuiz({ ...quiz, kind: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={quiz.grade} onValueChange={(v) => setQuiz({ ...quiz, grade: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g.n} value={String(g.n)}>{g.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={quiz.subject} onValueChange={(v) => setQuiz({ ...quiz, subject: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.key} value={s.key}>{s.en}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title (English)</Label>
                <Input required value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Title (اردو)</Label>
                <Input className="urdu" value={quiz.title_ur} onChange={(e) => setQuiz({ ...quiz, title_ur: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </CardContent>
        </Card>

        {activeId && (
          <Card className="card-soft">
            <CardHeader><CardTitle>Add a question</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={addQuestion} className="space-y-4">
                <div className="space-y-2">
                  <Label>Question (English)</Label>
                  <Input required value={question.prompt} onChange={(e) => setQuestion({ ...question, prompt: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Question (اردو)</Label>
                  <Input className="urdu" value={question.prompt_ur} onChange={(e) => setQuestion({ ...question, prompt_ur: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Options — one per line</Label>
                  <Textarea required rows={4} value={question.options} onChange={(e) => setQuestion({ ...question, options: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Correct option number</Label>
                  <Input type="number" min={1} value={question.correct} onChange={(e) => setQuestion({ ...question, correct: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Add question</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-3">
        {(data ?? []).map((q) => (
          <Card key={q.id} className="card-soft">
            <CardContent className="flex flex-wrap items-center gap-3 py-4">
              <Badge variant="secondary">{q.kind}</Badge>
              {q.grade && <Badge variant="outline">Grade {q.grade}</Badge>}
              <div>
                <p className="font-medium">{q.title}</p>
                {q.title_ur && <p className="urdu text-sm text-muted-foreground">{q.title_ur}</p>}
              </div>
              <div className="ms-auto flex gap-2">
                <Button size="sm" variant={activeId === q.id ? "default" : "outline"} onClick={() => setActiveId(q.id)}>
                  Add questions
                </Button>
                <Button size="icon" variant="outline" onClick={() => removeQuiz(q.id)} aria-label="Delete">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}