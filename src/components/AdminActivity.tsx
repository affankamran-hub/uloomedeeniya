import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type NameMap = Record<string, string>;

function useActivity() {
  return useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const [{ data: profiles }, { data: messages }, { data: attempts }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email"),
        supabase
          .from("messages")
          .select("id, sender_id, recipient_id, body, created_at")
          .order("created_at", { ascending: false })
          .limit(30),
        supabase
          .from("quiz_attempts")
          .select("id, user_id, quiz_id, score, total, created_at")
          .order("created_at", { ascending: false })
          .limit(30),
      ]);
      const names: NameMap = {};
      (profiles ?? []).forEach((p) => {
        names[p.id] = p.full_name || p.email;
      });
      return { names, messages: messages ?? [], attempts: attempts ?? [] };
    },
  });
}

export function ActivityTab() {
  const { data, isLoading } = useActivity();
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const names = data?.names ?? {};

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="card-soft">
        <CardHeader>
          <CardTitle>
            Recent messages <span className="urdu text-primary">حالیہ پیغامات</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data?.messages ?? []).map((m) => (
            <div key={m.id} className="rounded-md border border-border/70 p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{names[m.sender_id] ?? "Unknown"}</span>
                <Badge variant="outline">{m.recipient_id ? "Private" : "Group"}</Badge>
                <span className="ms-auto text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-muted-foreground">{m.body}</p>
            </div>
          ))}
          {(data?.messages ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>
            Quiz &amp; test activity <span className="urdu text-primary">کارکردگی</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data?.attempts ?? []).map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-2 rounded-md border border-border/70 p-3 text-sm"
            >
              <span className="font-medium">{names[a.user_id] ?? "Unknown"}</span>
              <Badge variant="secondary">
                {a.score} / {a.total}
              </Badge>
              <span className="ms-auto text-xs text-muted-foreground">
                {new Date(a.created_at).toLocaleString()}
              </span>
            </div>
          ))}
          {(data?.attempts ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No attempts yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
