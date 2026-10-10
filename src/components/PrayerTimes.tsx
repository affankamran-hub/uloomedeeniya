import { useState, useEffect } from "react";
import { Clock, MapPin, Moon, Sun, Sunrise, Sunset, Calendar, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSetting } from "@/lib/settings";

const BASE = [
  { key: "fajr", name: "Fajr", nameUr: "فجر", icon: Moon },
  { key: "sunrise", name: "Sunrise", nameUr: "طلوعِ آفتاب", icon: Sunrise },
  { key: "dhuhr", name: "Dhuhr", nameUr: "ظہر", icon: Sun },
  { key: "asr", name: "Asr", nameUr: "عصر", icon: Sun },
  { key: "maghrib", name: "Maghrib", nameUr: "مغرب", icon: Sunset },
  { key: "isha", name: "Isha", nameUr: "عشاء", icon: Moon },
] as const;

type Times = Record<string, string>; // 24h "HH:MM"
const DEFAULT_TIMES: Times = {
  fajr: "04:55", sunrise: "06:12", dhuhr: "12:30", asr: "16:45", maghrib: "18:48", isha: "20:10",
};

function fmt(t: string = "00:00") {
  const [h = 0, m = 0] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ap}`;
}
const mins = (t: string = "00:00") => {
  const [h = 0, m = 0] = t.split(":").map(Number);
  return h * 60 + m;
};

export function PrayerTimes() {
  const { isAdmin } = useAuth();
  const { value: saved, save } = useSetting<Times>("prayer_times", DEFAULT_TIMES);
  const times = { ...DEFAULT_TIMES, ...saved };
  const [now, setNow] = useState<Date | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Times>(times);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nowMin = now ? now.getHours() * 60 + now.getMinutes() : -1;
  let nextIndex = BASE.findIndex((p) => mins(times[p.key]) > nowMin);
  if (nextIndex === -1) nextIndex = 0;

  return (
    <Card className="card-soft border-gold/30 bg-card/90 shadow-md">
      <CardHeader className="pb-3 border-b border-border/60">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-gold" />
            <CardTitle className="text-lg font-bold">
              Karachi Prayer Times <span className="urdu text-primary font-normal">اوقاتِ نماز — کراچی</span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1 border-gold/40 text-gold">
              <MapPin className="size-3" /> Masjid e Tauheed, Rafa e Aam
            </Badge>
            {now && (
              <span className="font-mono text-xs text-muted-foreground">
                {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
              </span>
            )}
            {isAdmin && !editing && (
              <Button size="sm" variant="outline" onClick={() => { setDraft(times); setEditing(true); }}>
                <Pencil className="size-3.5" /> Edit times
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
          {BASE.map((prayer, i) => {
            const Icon = prayer.icon;
            const isNext = !editing && now !== null && i === nextIndex;
            return (
              <div
                key={prayer.key}
                className={`p-3 rounded-xl border transition-all ${
                  isNext ? "border-gold bg-gold/15 shadow-sm ring-1 ring-gold/50" : "border-border bg-background/50"
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Icon className={`size-3.5 ${isNext ? "text-gold" : ""}`} />
                  <span className="text-xs font-medium">{prayer.name}</span>
                </div>
                <p className="urdu text-sm font-semibold text-foreground">{prayer.nameUr}</p>
                {editing ? (
                  <Input
                    type="time"
                    className="mt-1 h-8 px-1 text-xs"
                    value={draft[prayer.key] ?? ""}
                    onChange={(e) => setDraft({ ...draft, [prayer.key]: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 font-mono text-xs font-bold text-foreground">{fmt(times[prayer.key])}</p>
                )}
                {isNext && (
                  <Badge variant="default" className="mt-1.5 text-[9px] px-1.5 py-0">Next / اگلی</Badge>
                )}
              </div>
            );
          })}
        </div>
        {editing && (
          <div className="flex gap-2">
            <Button size="sm" onClick={async () => { if (await save(draft)) setEditing(false); }}>Save times</Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        )}

        <div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" />
            <span>
              <strong>Jummah Mubarak:</strong> Khutbah starts at 1:00 PM • Jamat at 1:30 PM
            </span>
          </div>
          <p className="urdu text-primary font-medium">
            جمعۃ المبارک: خطبہ ۱:۰۰ بجے دوپہر • باجماعت نماز ۱:۳۰ بجے
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
