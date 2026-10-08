import { useEffect, useState } from "react";
import { Clock, Radio } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalMs: diff,
  };
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      setTimeLeft(calculateTimeLeft(targetDate));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units: { key: "days" | "hours" | "minutes" | "seconds"; labelEn: string; labelUr: string }[] = [
    { key: "days", labelEn: "Days", labelUr: "دن" },
    { key: "hours", labelEn: "Hours", labelUr: "گھنٹے" },
    { key: "minutes", labelEn: "Minutes", labelUr: "منٹ" },
    { key: "seconds", labelEn: "Seconds", labelUr: "سیکنڈ" },
  ];

  if (mounted && timeLeft.totalMs <= 0) {
    return (
      <div className="rounded-xl border border-gold/50 bg-gold/15 p-6 text-center shadow-lg">
        <div className="inline-flex items-center gap-2 text-gold font-bold text-lg">
          <Radio className="size-5 animate-pulse text-red-500" /> Class Session Active / درس کا وقت جاری ہے
        </div>
        <p className="mt-2 text-sm text-primary-foreground/90">
          Uloom e Deeniya session is currently in progress at Masjid e Tauheed, Rafa e Aam Society.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-primary-foreground/75 px-1">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Clock className="size-3.5 text-gold animate-spin-slow" /> Live Countdown / الٹی گنتی
        </span>
        <span className="urdu text-gold">برائے اتوار، یکم نومبر ۲۰۲۶، صبح ۸:۰۰ بجے</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {units.map((unit) => {
          const value = mounted ? String(timeLeft[unit.key]).padStart(2, "0") : "--";
          return (
            <div
              key={unit.key}
              className="group relative overflow-hidden rounded-2xl border border-gold/40 bg-primary-foreground/5 p-4 text-center backdrop-blur-md transition-all hover:border-gold hover:bg-primary-foreground/10 hover:shadow-lg"
            >
              <div className="font-mono text-4xl font-bold tracking-tight text-gold md:text-5xl">
                {value}
              </div>
              <div className="mt-1 text-xs font-medium text-primary-foreground/85 uppercase tracking-wider">
                {unit.labelEn}
              </div>
              <div className="urdu text-xs text-gold/90 font-medium">{unit.labelUr}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
