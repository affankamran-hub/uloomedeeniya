import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth, type Profile } from "@/hooks/useAuth";
import { CATEGORIES, GRADES, SUBJECTS } from "@/lib/site";
import { useContent, type ContentRow } from "@/components/ContentSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content: "Administration panel for approving students and publishing study material.",
      },
      { property: "og:title", content: "Administration | Uloom e Deeniya" },
      { property: "og:description", content: "Manage students and content of the institute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function MembersTab() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Profile[];
    },
  });

  const setApproved = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("profiles").update({ approved }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(approved ? "Member approved" : "Approval revoked");
    qc.invalidateQueries({ queryKey: ["profiles"] });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-3">
      {(data ?? []).map((p) => (
        <Card key={p.id} className="card-soft">
          <CardContent className="flex flex-wrap items-center gap-3 py-4">
            <div className="min-w-48">
              <p className="font-medium">{p.full_name || "(no name)"}</p>
              <p className="text-sm text-muted-foreground">{p.email}</p>
            </div>
            {p.requested_grade && (
              <Badge variant="outline">
                {GRADES.find((g) => g.n === p.requested_grade)?.en}
              </Badge>
            )}
            <Badge variant={p.approved ? "default" : "secondary"}>
              {p.approved ? "Approved" : "Pending"}
            </Badge>
            <Button
              size="sm"
              variant={p.approved ? "outline" : "default"}
              className="ms-auto"
              onClick={() => setApproved(p.id, !p.approved)}
            >
              {p.approved ? "Revoke" : "Approve"}
            </Button>
          </CardContent>
        </Card>
      ))}
      {(data ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">No registrations yet.</p>
      )}
    </div>
  );
}

function ContentTab() {
  const qc = useQueryClient();
  const { data } = useContent();
  const [form, setForm] = useState({
    category: "resource",
    grade: "1",
    subject: "tafheem",
    title: "",
    title_ur: "",
    description: "",
    url: "",
    event_date: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("content").insert({
      category: form.category,
      grade: form.category === "event" ? null : Number(form.grade),
      subject: form.category === "event" ? null : form.subject,
      title: form.title,
      title_ur: form.title_ur || null,
      description: form.description || null,
      url: form.url || null,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Published");
    setForm({ ...form, title: "", title_ur: "", description: "", url: "", event_date: "" });
    qc.invalidateQueries({ queryKey: ["content"] });
  };

  const remove = async (item: ContentRow) => {
    const { error } = await supabase.from("content").delete().eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["content"] });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <Card className="card-soft h-fit">
        <CardHeader><CardTitle>Add item</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.key} value={c.key}>{c.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.category !== "event" && (
              <>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
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
                  <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s.key} value={s.key}>{s.en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Title (اردو)</Label>
              <Input className="urdu" value={form.title_ur} onChange={(e) => setForm({ ...form, title_ur: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Link (PDF / video URL)</Label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </div>
            {form.category === "event" && (
              <div className="space-y-2">
                <Label>Event date</Label>
                <Input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
              </div>
            )}
            <Button type="submit" className="w-full">Publish</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {(data ?? []).map((item) => (
          <Card key={item.id} className="card-soft">
            <CardContent className="flex flex-wrap items-center gap-3 py-4">
              <Badge variant="secondary">{item.category}</Badge>
              {item.grade && <Badge variant="outline">Grade {item.grade}</Badge>}
              <div>
                <p className="font-medium">{item.title}</p>
                {item.title_ur && <p className="urdu text-sm text-muted-foreground">{item.title_ur}</p>}
              </div>
              <Button size="icon" variant="outline" className="ms-auto" onClick={() => remove(item)} aria-label="Delete">
                <Trash2 className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminPage() {
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-16">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Administrators only</CardTitle>
              <p className="urdu text-lg text-primary">صرف منتظمین کے لیے</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>This section manages members and study material of the institute.</p>
              <Button asChild><Link to="/auth">Sign in</Link></Button>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl">Administration</h1>
        <p className="urdu text-xl text-primary">انتظامیہ</p>
        <Tabs defaultValue="members" className="mt-8">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-6"><MembersTab /></TabsContent>
          <TabsContent value="content" className="mt-6"><ContentTab /></TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}
