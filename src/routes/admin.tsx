import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Pencil,
  ShieldCheck,
  ShieldOff,
  Trash2,
  X,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  Copy,
  RefreshCw,
  AlertCircle,
  LayoutDashboard,
  BookOpen,
  Megaphone,
  Upload,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth, type Profile } from "@/hooks/useAuth";
import { CATEGORIES, GRADES, SUBJECTS } from "@/lib/site";
import { useContent, type ContentRow } from "@/components/ContentSection";
import { UpdatesTab, QuizzesTab } from "@/components/AdminExtras";
import { ActivityTab } from "@/components/AdminActivity";
import { MATERIALS_BUCKET, STORAGE_PREFIX, isStorageUrl, storagePath } from "@/lib/materials";
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
  return <MembersTabInner currentUserId={currentUserId} />;
}

function NameEditor({ initial, onSave }: { initial: string; onSave: (name: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Full name"
        className="w-52"
      />
      <Button
        size="sm"
        variant="outline"
        disabled={value.trim() === initial.trim() || !value.trim()}
        onClick={() => onSave(value.trim())}
      >
        Save name
      </Button>
    </div>
  );
}

function MembersTabInner({ currentUserId }: { currentUserId: string }) {
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

  const setName = async (id: string, full_name: string) => {
    const { error } = await supabase.from("profiles").update({ full_name }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Name updated");
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

  const approveAllPending = async () => {
    const pendingIds = (data ?? []).filter((p) => !p.approved).map((p) => p.id);
    if (pendingIds.length === 0) {
      toast.info("No pending requests to approve.");
      return;
    }
    if (!window.confirm(`Approve all ${pendingIds.length} pending students at once?`)) return;
    const { error } = await supabase.from("profiles").update({ approved: true }).in("id", pendingIds);
    if (error) { toast.error(error.message); return; }
    toast.success(`Approved all ${pendingIds.length} students! / تمام طلبہ کو منظوری مل گئی`);
    refresh();
  };

  const exportMembers = () => {
    if (!data || data.length === 0) {
      toast.info("No members to export.");
      return;
    }
    const headers = ["Full Name", "Email", "Phone", "Grade", "Status", "Role", "Registered At"];
    const rows = data.map((p) => [
      `"${p.full_name || ''}"`,
      `"${p.email || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.requested_grade ? 'Grade ' + p.requested_grade : 'None'}"`,
      `"${p.approved ? 'Approved' : 'Pending'}"`,
      `"${p.isAdmin ? 'Admin' : 'Student'}"`,
      `"${new Date(p.created_at).toLocaleDateString()}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `uloomedeeniya-students-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success("Student records exported to CSV! / ریکارڈ ڈاؤنلوڈ ہو گیا");
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
      <div className="flex flex-wrap items-center justify-between gap-3">
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
              <SelectItem value="all">All members ({data?.length ?? 0})</SelectItem>
              <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
              <SelectItem value="approved">Approved ({(data?.length ?? 0) - pendingCount})</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant={pendingCount ? "default" : "secondary"}>
            {pendingCount} awaiting approval / زیرِ غور
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Button size="sm" variant="gold" onClick={approveAllPending} className="gap-1.5 font-semibold">
              <CheckCircle2 className="size-4" /> Approve All ({pendingCount})
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={exportMembers} className="gap-1.5">
            <Download className="size-4" /> Export CSV / ڈاؤنلوڈ
          </Button>
        </div>
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
              <NameEditor
                key={p.full_name}
                initial={p.full_name}
                onSave={(name) => setName(p.id, name)}
              />
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
  const [uploading, setUploading] = useState(false);
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
    if (isStorageUrl(item.url)) {
      await supabase.storage.from(MATERIALS_BUCKET).remove([storagePath(item.url!)]);
    }
    const { error } = await supabase.from("content").delete().eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    if (editingId === item.id) reset();
    qc.invalidateQueries({ queryKey: ["content"] });
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `grade-${form.grade}/${form.subject}/${Date.now()}-${safe}`;
    const { error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .upload(path, file, { contentType: file.type || "application/pdf" });
    setUploading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm((f) => ({ ...f, url: `${STORAGE_PREFIX}${path}`, title: f.title || file.name }));
    toast.success("File uploaded — now publish it");
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
            {form.category !== "event" && (
              <div className="space-y-2">
                <Label>{form.category === "lecture" ? "Upload Lecture Video (MP4/WebM) or PDF" : "Upload PDF / Document / Image / Video"}</Label>
                <label
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
                    uploading
                      ? "border-primary/40 bg-primary/5"
                      : isStorageUrl(form.url)
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <input
                    type="file"
                    accept={form.category === "lecture" ? "video/*,.mp4,.webm,.mov,.mkv,application/pdf,.pdf" : "application/pdf,.pdf,.doc,.docx,image/*,video/*"}
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadFile(file);
                      e.target.value = "";
                    }}
                  />
                  {uploading ? (
                    <>
                      <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      <p className="text-sm font-medium text-primary">Uploading… large videos may take a few minutes</p>
                    </>
                  ) : isStorageUrl(form.url) ? (
                    <>
                      <FileText className="size-8 text-green-600" />
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">File attached ✓</p>
                      <p className="break-all text-xs text-muted-foreground">{storagePath(form.url)}</p>
                      <p className="text-xs text-muted-foreground">Click to replace</p>
                    </>
                  ) : (
                    <>
                      <Upload className="size-8 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Click to upload PDF, Word doc, or image</p>
                      <p className="text-xs text-muted-foreground">Accessible to approved students only · Max 50 MB</p>
                    </>
                  )}
                </label>
                {isStorageUrl(form.url) && (
                  <button
                    type="button"
                    className="text-xs text-destructive underline-offset-4 hover:underline"
                    onClick={() => setForm((f) => ({ ...f, url: "" }))}
                  >
                    Remove attachment
                  </button>
                )}
              </div>
            )}
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

function AdminOverviewKPIs() {
  const { data: profiles } = useQuery({
    queryKey: ["profiles-kpi"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, approved");
      return data ?? [];
    },
  });

  const { data: content } = useQuery({
    queryKey: ["content-kpi"],
    queryFn: async () => {
      const { data } = await supabase.from("content").select("id");
      return data ?? [];
    },
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements-kpi"],
    queryFn: async () => {
      const { data } = await supabase.from("announcements").select("id");
      return data ?? [];
    },
  });

  const { data: quizzes } = useQuery({
    queryKey: ["quizzes-kpi"],
    queryFn: async () => {
      const { data } = await supabase.from("quizzes").select("id");
      return data ?? [];
    },
  });

  const totalMembers = profiles?.length ?? 0;
  const pendingMembers = profiles?.filter((p) => !p.approved).length ?? 0;
  const totalContent = content?.length ?? 0;
  const totalAnnouncements = announcements?.length ?? 0;
  const totalQuizzes = quizzes?.length ?? 0;

  const cards = [
    { label: "Total Students", labelUr: "کل طلبہ", value: totalMembers, icon: Users, color: "text-blue-500" },
    {
      label: "Pending Approvals",
      labelUr: "زیرِ غور داخلے",
      value: pendingMembers,
      icon: AlertCircle,
      color: pendingMembers > 0 ? "text-amber-500 font-bold" : "text-green-500",
      alert: pendingMembers > 0,
    },
    { label: "Study Materials", labelUr: "کتب و درسی مواد", value: totalContent, icon: BookOpen, color: "text-emerald-500" },
    { label: "Announcements", labelUr: "اطلاعات", value: totalAnnouncements, icon: Megaphone, color: "text-purple-500" },
    { label: "Quizzes & Tests", labelUr: "امتحانات و کوئز", value: totalQuizzes, icon: LayoutDashboard, color: "text-gold" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} className={`card-soft overflow-hidden ${c.alert ? "border-amber-500/50 bg-amber-500/5" : ""}`}>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>{c.label}</span>
                <Icon className={`size-4 ${c.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className="urdu text-xs text-muted-foreground">{c.labelUr}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function AdminPage() {
  const { loading, user, isAdmin } = useAuth();
  const [copiedSql, setCopiedSql] = useState(false);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-16">
          <Card className="card-soft text-center p-6 space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sign In Required</CardTitle>
              <p className="urdu text-lg text-primary">پہلے لاگ ان کیجیے</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Please sign in with your authorized administrator email to access this panel.</p>
              <Button asChild variant="gold" className="w-full font-semibold">
                <Link to="/auth">Go to Sign In / داخلہ کیجیے</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    const grantAdminSql = `INSERT INTO user_roles (user_id, role) VALUES ('${user.id}', 'admin') ON CONFLICT DO NOTHING;`;

    const copySql = () => {
      navigator.clipboard.writeText(grantAdminSql);
      setCopiedSql(true);
      toast.success("SQL command copied to clipboard!");
      setTimeout(() => setCopiedSql(false), 2000);
    };

    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-16">
          <Card className="card-soft border-amber-500/40 shadow-lg">
            <CardHeader className="bg-amber-500/10 border-b border-border/60 pb-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <ShieldCheck className="size-6" />
                <CardTitle className="text-xl font-bold">Administrator Access Required</CardTitle>
              </div>
              <p className="urdu text-base text-primary">صرف مجاز منتظمین کے لیے</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-5 text-sm text-muted-foreground">
              <p>
                You are currently signed in as <strong className="text-foreground">{user.email}</strong>, but this account has not been assigned the <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">admin</code> role in the database yet.
              </p>

              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-foreground font-semibold">
                  <span>Your Supabase User ID:</span>
                  <span className="font-mono text-muted-foreground">{user.id}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  If you are the institute owner, open your <strong>Supabase Dashboard → SQL Editor</strong> and run this command:
                </p>
                <div className="relative">
                  <pre className="p-3 rounded bg-background border border-border text-xs font-mono overflow-x-auto text-foreground">
                    {grantAdminSql}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copySql}
                    className="absolute top-2 end-2 h-7 text-xs gap-1"
                  >
                    {copiedSql ? <CheckCircle2 className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                    {copiedSql ? "Copied" : "Copy SQL"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="gap-1.5"
                  variant="default"
                >
                  <RefreshCw className="size-4" /> Check &amp; Refresh Access / تصدیق کریں
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Back to Home / صفحۂ اول</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Administration Control Center</h1>
            <p className="urdu text-2xl text-primary font-medium">مرکزی انتظامی پینل — علوم دینیہ</p>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs border-gold text-gold">
            <ShieldCheck className="size-4" /> Logged in as Administrator
          </Badge>
        </div>

        {/* Executive KPI Overview Bar */}
        <AdminOverviewKPIs />

        <Tabs defaultValue="members" className="mt-8">
          <TabsList className="flex h-auto flex-wrap gap-1 border-b border-border pb-2">
            <TabsTrigger value="members" className="gap-1.5">
              <Users className="size-4" /> Members / طلبہ
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-1.5">
              <BookOpen className="size-4" /> Study Content / مواد
            </TabsTrigger>
            <TabsTrigger value="updates" className="gap-1.5">
              <Megaphone className="size-4" /> Announcements / اطلاعات
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="gap-1.5">
              <LayoutDashboard className="size-4" /> Quizzes &amp; Tests / کوئز
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5">
              <RefreshCw className="size-4" /> Audit Activity / سرگرمیاں
            </TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-6">
            <MembersTab currentUserId={user.id} />
          </TabsContent>
          <TabsContent value="content" className="mt-6">
            <ContentTab />
          </TabsContent>
          <TabsContent value="updates" className="mt-6">
            <UpdatesTab />
          </TabsContent>
          <TabsContent value="quizzes" className="mt-6">
            <QuizzesTab />
          </TabsContent>
          <TabsContent value="activity" className="mt-6">
            <ActivityTab />
          </TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}
