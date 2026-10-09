import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, FileText, Link2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GRADES, SUBJECTS, subjectName } from "@/lib/site";
import {
  isStorageUrl,
  signedMaterialUrl,
  MATERIALS_BUCKET,
  STORAGE_PREFIX,
} from "@/lib/materials";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ContentRow = {
  id: string;
  category: string;
  grade: number | null;
  subject: string | null;
  title: string;
  title_ur: string | null;
  description: string | null;
  url: string | null;
  event_date: string | null;
};

export function useContent(category?: string, grade?: number) {
  return useQuery({
    queryKey: ["content", category ?? "all", grade ?? "all"],
    queryFn: async () => {
      let q = supabase.from("content").select("*").order("created_at", { ascending: false });
      if (category) q = q.eq("category", category);
      if (grade) q = q.eq("grade", grade);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as ContentRow[];
    },
  });
}

export function ContentCards({ items }: { items: ContentRow[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
        Nothing published here yet. <span className="urdu">ابھی کچھ شائع نہیں ہوا۔</span>
      </p>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id} className="card-soft border-border/70">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {item.grade && (
                <Badge variant="secondary">
                  {GRADES.find((g) => g.n === item.grade)?.en}
                </Badge>
              )}
              {subjectName(item.subject) && (
                <Badge variant="outline">{subjectName(item.subject)!.en}</Badge>
              )}
            </div>
            <CardTitle className="mt-2 text-lg">{item.title}</CardTitle>
            {item.title_ur && <p className="urdu text-base text-muted-foreground">{item.title_ur}</p>}
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {item.description && <p>{item.description}</p>}
            {item.event_date && (
              <p className="flex items-center gap-2 text-foreground">
                <CalendarDays className="size-4" />
                {new Date(item.event_date).toLocaleString()}
              </p>
            )}
            {item.url && isStorageUrl(item.url) && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const url = await signedMaterialUrl(item.url!);
                    window.open(url, "_blank", "noopener");
                  } catch (err) {
                    toast.error(
                      err instanceof Error
                        ? "Sign in with an approved account to open this file."
                        : "Could not open this file.",
                    );
                  }
                }}
                className="inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
              >
                <FileText className="size-4" />
                Open file / فائل کھولیں
              </button>
            )}
            {item.url && !isStorageUrl(item.url) && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-medium text-primary underline-offset-4 hover:underline"
              >
                {item.url.endsWith(".pdf") ? <FileText className="size-4" /> : <Link2 className="size-4" />}
                Open
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminUploadPanel({ category }: { category: string }) {
  const qc = useQueryClient();
  const [grade, setGrade] = useState("1");
  const [subject, setSubject] = useState("tafheem");
  const [title, setTitle] = useState("");
  const [titleUr, setTitleUr] = useState("");
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const safe = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `grade-${grade}/${subject}/${Date.now()}-${safe}`;
      const { error } = await supabase.storage
        .from(MATERIALS_BUCKET)
        .upload(path, file, { contentType: file.type || "application/pdf" });
      if (error) {
        toast.error(error.message);
        return;
      }
      const { error: dbError } = await supabase.from("content").insert({
        category,
        grade: Number(grade),
        subject,
        title: title.trim() || file.name,
        title_ur: titleUr.trim() || null,
        url: `${STORAGE_PREFIX}${path}`,
      });
      if (dbError) {
        toast.error(dbError.message);
        return;
      }
      toast.success("PDF uploaded and published / فائل اپ لوڈ ہو گئی");
      setTitle("");
      setTitleUr("");
      qc.invalidateQueries({ queryKey: ["content"] });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="card-soft border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Upload assignment PDF <span className="urdu text-base">· مشق اپ لوڈ کریں</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Grade</Label>
            <Select value={grade} onValueChange={setGrade}>
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
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s.key} value={s.key}>{s.en}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title (English)</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave blank to use the file name"
            />
          </div>
          <div className="space-y-2">
            <Label>Title (اردو)</Label>
            <Input className="urdu" value={titleUr} onChange={(e) => setTitleUr(e.target.value)} />
          </div>
        </div>
        <label
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
            uploading ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <>
              <div className="size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-primary">Uploading… / اپ لوڈ ہو رہی ہے</p>
            </>
          ) : (
            <>
              <Upload className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Click to upload a PDF / پی ڈی ایف منتخب کریں</p>
              <p className="text-xs text-muted-foreground">
                Visible to approved students only · Max 50 MB
              </p>
            </>
          )}
        </label>
      </CardContent>
    </Card>
  );
}

export function CategoryPage({
  category,
  titleEn,
  titleUr,
  intro,
  allowUpload,
}: {
  category: string;
  titleEn: string;
  titleUr: string;
  intro: string;
  allowUpload?: boolean;
}) {
  const { isAdmin } = useAuth();
  const { data, isLoading } = useContent(category);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl text-foreground">{titleEn}</h1>
      <p className="urdu text-xl text-primary">{titleUr}</p>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{intro}</p>
      {allowUpload && isAdmin && (
        <div className="mt-8">
          <AdminUploadPanel category={category} />
        </div>
      )}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : (
          <ContentCards items={data ?? []} />
        )}
      </div>
    </div>
  );
}
