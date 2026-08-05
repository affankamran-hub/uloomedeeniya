import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, ShieldCheck, ShieldOff, Trash2, X } from "lucide-react";
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

function MembersTab({ currentUserId }: { currentUserId: string }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roles, error: roleError }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (error) throw error;
      if (roleError) throw roleError;
      const adminIds = new Set(
        (roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id),
      );
      return ((profiles ?? []) as unknown as Profile[]).map((p) => ({
        ...p,
        isAdmin: adminIds.has(p.id),
      }));
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["profiles"] });

  const setApproved = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("profiles").update({ approved }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(approved ? "Member approved — login complete" : "Approval revoked");
    refresh();
  };

  const setGrade = async (id: string, grade: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ requested_grade: grade === "none" ? null : Number(grade) })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Grade updated");
    refresh();
  };

  const setAdminRole = async (id: string, makeAdmin: boolean) => {
    const { error } = makeAdmin
      ? await supabase.from("user_roles").insert({ user_id: id, role: "admin" })
      : await supabase.from("user_roles").delete().eq("user_id", id).eq("role", "admin");
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(makeAdmin ? "Administrator rights granted" : "Administrator rights removed");
    refresh();
  };

  const removeMember = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name || "this member"} from the institute records?`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Member removed");
    refresh();
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const term = search.trim().toLowerCase();
  const list = (data ?? []).filter((p) => {
    if (filter === "pending" && p.approved) return false;
    if (filter === "approved" && !p.approved) return false;
    if (!term) return true;
    return (
      p.full_name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      (p.phone ?? "").toLowerCase().includes(term)
    );
  });
  const pendingCount = (data ?? []).filter((p) => !p.approved).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All members</SelectItem>
            <SelectItem value="pending">Pending approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant={pendingCount ? "default" : "secondary"}>
          {pendingCount} awaiting approval / زیرِ غور
        </Badge>
      </div>

      {list.map((p) => (
        <Card key={p.id} className="card-soft">
          <CardContent className="space-y-4 py-5">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-52">
                <p className="font-medium">{p.full_name || "(no name)"}</p>
                <p className="text-sm text-muted-foreground">{p.email}</p>
                {p.phone && <p className="text-sm text-muted-foreground">{p.phone}</p>}
                <p className="text-xs text-muted-foreground">
                  Registered {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={p.approved ? "default" : "secondary"}>
                  {p.approved ? "Approved / منظور" : "Pending / زیرِ غور"}
                </Badge>
                <Badge variant={p.isAdmin ? "default" : "outline"}>
                  {p.isAdmin ? "Administrator / منتظم" : "Student / طالبِ علم"}
                </Badge>
                {p.requested_grade && (
                  <Badge variant="outline" className="urdu">
                    {GRADES.find((g) => g.n === p.requested_grade)?.ur}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={p.requested_grade ? String(p.requested_grade) : "none"}
                onValueChange={(v) => setGrade(p.id, v)}
              >
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No grade</SelectItem>
                  {GRADES.map((g) => (
                    <SelectItem key={g.n} value={String(g.n)}>{g.en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant={p.approved ? "outline" : "default"}
                onClick={() => setApproved(p.id, !p.approved)}
              >
                {p.approved ? "Revoke access" : "Approve login"}
              </Button>
              {p.id !== currentUserId && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAdminRole(p.id, !p.isAdmin)}
                  >
                    {p.isAdmin ? (
                      <><ShieldOff className="me-1 size-4" /> Remove admin</>
                    ) : (
                      <><ShieldCheck className="me-1 size-4" /> Make admin</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ms-auto"
                    onClick={() => removeMember(p.id, p.full_name)}
                  >
                    <Trash2 className="me-1 size-4" /> Remove
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {list.length === 0 && (
        <p className="text-sm text-muted-foreground">No members match this view.</p>
      )}
    </div>
  );
}

function ContentTab() {
  const qc = useQueryClient();
  const { data } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const reset = () => {
    setEditingId(null);
    setForm({
      category: "resource",
      grade: "1",
      subject: "tafheem",
      title: "",
      title_ur: "",
      description: "",
      url: "",
      event_date: "",
    });
  };

  const startEdit = (item: ContentRow) => {
    setEditingId(item.id);
    setForm({
      category: item.category,
      grade: item.grade ? String(item.grade) : "1",
      subject: item.subject ?? "tafheem",
      title: item.title,
      title_ur: item.title_ur ?? "",
      description: item.description ?? "",
      url: item.url ?? "",
      event_date: item.event_date ? item.event_date.slice(0, 16) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      category: form.category,
      grade: form.category === "event" ? null : Number(form.grade),
      subject: form.category === "event" ? null : form.subject,
      title: form.title,
      title_ur: form.title_ur || null,
      description: form.description || null,
      url: form.url || null,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
    };
    const { error } = editingId
      ? await supabase.from("content").update(payload).eq("id", editingId)
      : await supabase.from("content").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Updated" : "Published");
    reset();
    qc.invalidateQueries({ queryKey: ["content"] });
  };

  const remove = async (item: ContentRow) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    const { error } = await supabase.from("content").delete().eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    if (editingId === item.id) reset();
    qc.invalidateQueries({ queryKey: ["content"] });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <Card className="card-soft h-fit">
        <CardHeader>
          <CardTitle>{editingId ? "Edit item" : "Add item"}</CardTitle>
        </CardHeader>
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
            <Button type="submit" className="w-full">
              {editingId ? "Save changes" : "Publish"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="w-full" onClick={reset}>
                <X className="me-1 size-4" /> Cancel edit
              </Button>
            )}
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
              <div className="ms-auto flex gap-2">
                <Button size="icon" variant="outline" onClick={() => startEdit(item)} aria-label="Edit">
                  <Pencil className="size-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => remove(item)} aria-label="Delete">
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
          <TabsContent value="members" className="mt-6">
            <MembersTab currentUserId={user.id} />
          </TabsContent>
          <TabsContent value="content" className="mt-6"><ContentTab /></TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}
