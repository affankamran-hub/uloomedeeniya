import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Send, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content: "Group chat for students and private messages with the teachers of Uloom e Deeniya.",
      },
      { property: "og:title", content: "Messages | Uloom e Deeniya" },
      { property: "og:description", content: "Ask your teachers and talk with fellow students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MessagesPage,
});

type MessageRow = {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  body: string;
  created_at: string;
};

type Person = { id: string; full_name: string | null };

function Thread({
  recipientId,
  userId,
  isAdmin,
  names,
}: {
  recipientId: string | null;
  userId: string;
  isAdmin: boolean;
  names: Map<string, string>;
}) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const key = ["messages", recipientId ?? "group"];

  const { data } = useQuery({
    queryKey: key,
    queryFn: async () => {
      let q = supabase.from("messages").select("*").order("created_at", { ascending: true });
      q = recipientId
        ? q.not("recipient_id", "is", null).or(
            `and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`,
          )
        : q.is("recipient_id", null);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as MessageRow[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`messages-${recipientId ?? "group"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        qc.invalidateQueries({ queryKey: key });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [data]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = body.trim();
    if (!text) return;
    const { error } = await supabase
      .from("messages")
      .insert({ sender_id: userId, recipient_id: recipientId, body: text });
    if (error) {
      toast.error(error.message);
      return;
    }
    setBody("");
    qc.invalidateQueries({ queryKey: key });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: key });
  };

  return (
    <div className="flex h-[32rem] flex-col rounded-lg border border-border bg-card">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {(data ?? []).length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No messages yet. <span className="urdu">ابھی کوئی پیغام نہیں۔</span>
          </p>
        )}
        {(data ?? []).map((m) => {
          const mine = m.sender_id === userId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                {!mine && (
                  <p className="mb-1 text-xs font-medium opacity-80">
                    {names.get(m.sender_id) ?? "Member"}
                  </p>
                )}
                <p className="whitespace-pre-line">{m.body}</p>
                <p className="mt-1 text-[10px] opacity-70">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              {(mine || isAdmin) && (
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="ms-1 self-center"
                  onClick={() => remove(m.id)}
                  aria-label="Delete message"
                >
                  <Trash2 className="size-3" />
                </Button>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex items-end gap-2 border-t border-border p-3">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder="Write a message… / پیغام لکھیے"
        />
        <Button type="submit" size="icon" aria-label="Send">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

function MessagesPage() {
  const { user, profile, isAdmin, isTeacher, loading } = useAuth();
  const [active, setActive] = useState<string | null>(null);

  const { data: teachers } = useQuery({
    queryKey: ["teacher-list"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("teacher_list");
      if (error) throw error;
      return (data ?? []) as unknown as (Person & { role: string })[];
    },
  });

  const { data: members } = useQuery({
    queryKey: ["member-names"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("member_names");
      if (error) throw error;
      return (data ?? []) as unknown as Person[];
    },
  });

  const names = new Map<string, string>();
  for (const p of members ?? []) names.set(p.id, p.full_name || "Member");

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
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Sign in to use messages</CardTitle>
              <p className="urdu text-lg text-primary">پیغامات کے لیے لاگ اِن کریں</p>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/auth">Login / Register</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    );
  }

  const allowed = isAdmin || isTeacher || !!profile?.approved;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl">Messages</h1>
        <p className="urdu text-xl text-primary">پیغامات</p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A group chat for all students of the institute, and private conversations with your teachers.
        </p>

        {!allowed ? (
          <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Your account is awaiting administrator approval before chat opens.{" "}
            <span className="urdu">آپ کا اکاؤنٹ منظوری کا منتظر ہے۔</span>
          </p>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <div className="space-y-2">
              <Button
                variant={active === null ? "default" : "outline"}
                className="w-full justify-start gap-2"
                onClick={() => setActive(null)}
              >
                <Users className="size-4" /> Group chat
                <span className="urdu ms-auto text-xs">گروپ</span>
              </Button>
              <p className="pt-3 text-xs font-medium uppercase text-muted-foreground">
                Teachers / اساتذہ
              </p>
              {(teachers ?? [])
                .filter((t) => t.id !== user.id)
                .map((t) => (
                  <Button
                    key={t.id}
                    variant={active === t.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActive(t.id)}
                  >
                    <span className="truncate">{t.full_name || "Teacher"}</span>
                    <Badge variant="secondary" className="ms-auto">
                      {t.role}
                    </Badge>
                  </Button>
                ))}
              {(teachers ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No teachers listed yet.</p>
              )}
              {(isAdmin || isTeacher) && (
                <>
                  <p className="pt-3 text-xs font-medium uppercase text-muted-foreground">
                    Students / طلبہ
                  </p>
                  <div className="max-h-64 space-y-2 overflow-y-auto pe-1">
                    {(members ?? [])
                      .filter((m) => m.id !== user.id && !(teachers ?? []).some((t) => t.id === m.id))
                      .map((m) => (
                        <Button
                          key={m.id}
                          variant={active === m.id ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => setActive(m.id)}
                        >
                          <span className="truncate">{m.full_name || "Student"}</span>
                        </Button>
                      ))}
                  </div>
                </>
              )}
            </div>
            <Thread recipientId={active} userId={user.id} isAdmin={isAdmin} names={names} />
          </div>
        )}
      </div>
    </SiteLayout>
  );
}