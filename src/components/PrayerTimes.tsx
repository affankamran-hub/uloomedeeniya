import { useState, useEffect } from "react";
import { Clock, MapPin, Moon, Sun, Sunrise, Sunset, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Prayer = {
  name: string;
  nameUr: string;
  time: string;
  icon: typeof Sun;
  isNext?: boolean;
};

// Karachi standard approximate calculation / prayer schedule
function getKarachiPrayerTimes(date: Date): Prayer[] {
  // Approximate standard Karachi times for early September
  const prayers: Prayer[] = [
    { name: "Fajr", nameUr: "فجر", time: "04:55 AM", icon: Moon },
    { name: "Sunrise", nameUr: "طلوعِ آفتاب", time: "06:12 AM", icon: Sunrise },
    { name: "Dhuhr", nameUr: "ظہر", time: "12:30 PM", icon: Sun },
    { name: "Asr", nameUr: "عصر", time: "04:45 PM", icon: Sun },
    { name: "Maghrib", nameUr: "مغرب", time: "06:48 PM", icon: Sunset },
    { name: "Isha", nameUr: "عشاء", time: "08:10 PM", icon: Moon },
  ];

  const now = date.getHours() * 60 + date.getMinutes();
  const timesInMinutes = [
    4 * 60 + 55,  // Fajr
    6 * 60 + 12,  // Sunrise
    12 * 60 + 30, // Dhuhr
    16 * 60 + 45, // Asr
    18 * 60 + 48, // Maghrib
    20 * 60 + 10, // Isha
  ];

  let nextIndex = timesInMinutes.findIndex((t) => t > now);
  if (nextIndex === -1) nextIndex = 0; // After Isha, next is Fajr

  return prayers.map((p, i) => ({
    ...p,
    isNext: i === nextIndex,
  }));
}

export function PrayerTimes() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setPrayers(getKarachiPrayerTimes(now));
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

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
            {currentTime && (
              <span className="font-mono text-xs text-muted-foreground">{currentTime}</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
          {prayers.map((prayer) => {
            const Icon = prayer.icon;
            return (
              <div
                key={prayer.name}
                className={`p-3 rounded-xl border transition-all ${
                  prayer.isNext
                    ? "border-gold bg-gold/15 shadow-sm ring-1 ring-gold/50"
                    : "border-border bg-background/50 hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Icon className={`size-3.5 ${prayer.isNext ? "text-gold" : ""}`} />
                  <span className="text-xs font-medium">{prayer.name}</span>
                </div>
                <p className="urdu text-sm font-semibold text-foreground">{prayer.nameUr}</p>
                <p className="mt-1 font-mono text-xs font-bold text-foreground">{prayer.time}</p>
                {prayer.isNext && (
                  <Badge variant="default" className="mt-1.5 text-[9px] px-1.5 py-0 bg-gold text-slate-950">
                    Next / اگلی
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

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
