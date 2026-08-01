import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { GraduationCap, ShieldCheck, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteLayout } from "@/components/SiteLayout";
import { GRADES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content:
          "Your student or administrator profile at Uloom e Deeniya — enrolment grade, approval status and account details.",
      },
      { property: "og:title", content: "My Profile | Uloom e Deeniya" },
      {
        property: "og:description",
        content: "Student and administrator profiles for Uloom e Deeniya, Karachi.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function AdminProfile() {
  const { data } = useQuery({
    queryKey: ["admin-profile-stats"],
    queryFn: async () => {
      const [members, pending, content] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("approved", false),
        supabase.from("content").select("id", { count: "exact", head: true }),
      ]);
      return {
        members: members.count ?? 0,
        pending: pending.count ?? 0,
        content: content.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Registered members", ur: "کل اراکین", value: data?.members },
    { label: "Awaiting approval", ur: "منظوری کے منتظر", value: data?.pending },
    { label: "Published material", ur: "شائع شدہ مواد", value: data?.content },
  ];

  return (
    <Card className="card-soft border-gold/40">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="size-5" />
          <CardTitle className="text-xl">
            Administrator panel <span className="urdu">منتظم</span>
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          You can approve students and publish or remove material for every grade.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-2xl font-semibold text-primary">{s.value ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="urdu text-sm text-muted-foreground">{s.ur}</p>
            </div>
          ))}
        </div>
        <Button asChild variant="gold">
          <Link to="/admin">Open admin panel / منتظم پینل</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function StudentProfile({ approved, grade }: { approved: boolean; grade: number | null }) {
  const gradeInfo = GRADES.find((g) => g.n === grade);
  return (
    <Card className="card-soft">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="size-5" />
          <CardTitle className="text-xl">
            Student profile <span className="urdu">طالبِ علم</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="text-muted-foreground">Enrolled grade / درجہ</p>
          <p className="text-base text-foreground">
            {gradeInfo ? gradeInfo.en : "Not selected"}{" "}
            {gradeInfo && <span className="urdu text-primary">{gradeInfo.ur}</span>}
          </p>
        </div>
        {approved ? (
          <>
            <p className="text-muted-foreground">
              Your account is approved — all study material for your grade is open to you.
            </p>
            <Button asChild variant="gold">
              <Link to="/grades" search={{ grade: grade ?? 1 }}>
                Go to my grade / میرا درجہ
              </Link>
            </Button>
          </>
        ) : (
          <p className="rounded-lg border border-dashed p-4 text-muted-foreground">
            Your registration is waiting for administrator approval. Public material is available
            meanwhile.{" "}
            <span className="urdu">آپ کی رجسٹریشن منتظم کی منظوری کی منتظر ہے۔</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ProfilePage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setPhone(profile.phone ?? "");
    setGrade(profile.requested_grade ? String(profile.requested_grade) : "");
  }, [profile]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Skeleton className="h-48" />
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl">My Profile</h1>
          <p className="urdu text-xl text-primary">میرا پروفائل</p>
          <p className="mt-4 text-muted-foreground">
            Please sign in to view your profile.{" "}
            <span className="urdu">پروفائل دیکھنے کے لیے سائن اِن کریں۔</span>
          </p>
          <Button asChild className="mt-6" variant="gold">
            <Link to="/auth">Login / Register</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        requested_grade: grade ? Number(grade) : null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved / پروفائل محفوظ ہو گیا");
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <UserRound className="size-7" />
          </div>
          <div>
            <h1 className="text-3xl">{profile?.full_name || "My Profile"}</h1>
            <p className="urdu text-lg text-primary">میرا پروفائل</p>
          </div>
          <div className="ms-auto flex gap-2">
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "Administrator / منتظم" : "Student / طالبِ علم"}
            </Badge>
            {!isAdmin && (
              <Badge variant={profile?.approved ? "default" : "outline"}>
                {profile?.approved ? "Approved / منظور" : "Pending / زیرِ غور"}
              </Badge>
            )}
          </div>
        </div>

        {isAdmin ? (
          <AdminProfile />
        ) : (
          <StudentProfile
            approved={!!profile?.approved}
            grade={profile?.requested_grade ?? null}
          />
        )}

        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-lg">
              Account details <span className="urdu text-primary">اکاؤنٹ کی تفصیل</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / ای میل</Label>
              <Input id="email" value={user.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name / پورا نام</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone / فون</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {!isAdmin && (
              <div className="space-y-2">
                <Label>Grade / درجہ</Label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map((g) => (
                      <SelectItem key={g.n} value={String(g.n)}>
                        {g.en} — {g.ur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button onClick={save} disabled={saving} variant="gold">
              {saving ? "Saving…" : "Save changes / محفوظ کریں"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
