import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/useAuth";
import { GRADES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content:
          "Students of Uloom e Deeniya sign in here. New registrations are activated only after approval by the institute administration.",
      },
      { property: "og:title", content: "Login or Register | Uloom e Deeniya" },
      { property: "og:description", content: "Access student material after admin approval." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [grade, setGrade] = useState("1");

  useEffect(() => {
    if (isAdmin) navigate({ to: "/admin" });
  }, [isAdmin, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Signed in / خوش آمدید");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, phone, requested_grade: grade },
      },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else
      toast.success(
        "Request submitted. Please confirm your email; access is granted after admin approval.",
      );
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  if (!loading && user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl px-4 py-16">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>
                {profile?.approved ? "Account active" : "Awaiting admin approval"}
              </CardTitle>
              <p className="urdu text-lg text-primary">
                {profile?.approved ? "آپ کا اکاؤنٹ فعال ہے" : "منتظمِ ادارہ کی منظوری کا انتظار"}
              </p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Signed in as {user.email}.</p>
              <p>
                {profile?.approved
                  ? "You may now access all student material for your grade."
                  : "Registration is not complete until the administration approves your request. Please contact the institute at Masjid e Tauheed, Rafa e Aam."}
              </p>
              <Button onClick={() => supabase.auth.signOut()} variant="outline">
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="text-2xl">Login / Register</CardTitle>
            <p className="urdu text-lg text-primary">داخلہ / رجسٹریشن</p>
            <p className="text-sm text-muted-foreground">
              New accounts stay pending until an administrator approves them.
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={signIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="li-email">Email</Label>
                    <Input id="li-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="li-pass">Password</Label>
                    <Input id="li-pass" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>Sign in</Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form onSubmit={signUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Full name / نام</Label>
                    <Input id="su-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-phone">Phone</Label>
                    <Input id="su-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade / درجہ</Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {GRADES.map((g) => (
                          <SelectItem key={g.n} value={String(g.n)}>{g.en} — {g.ur}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pass">Password</Label>
                    <Input id="su-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>Request registration</Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={google}>
                Continue with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
