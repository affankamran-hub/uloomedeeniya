import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units: { key: keyof TimeLeft; labelEn: string; labelUr: string }[] = [
    { key: "days", labelEn: "Days", labelUr: "دن" },
    { key: "hours", labelEn: "Hours", labelUr: "گھنٹے" },
    { key: "minutes", labelEn: "Minutes", labelUr: "منٹ" },
    { key: "seconds", labelEn: "Seconds", labelUr: "سیکنڈ" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {units.map((unit) => (
        <div
          key={unit.key}
          className="rounded-xl border border-gold/40 bg-primary/10 p-4 text-center backdrop-blur-sm"
        >
          <div className="font-display text-3xl font-semibold text-gold md:text-4xl">
            {timeLeft ? String(timeLeft[unit.key]).padStart(2, "0") : "--"}
          </div>
          <div className="mt-1 text-xs text-primary-foreground/80">{unit.labelEn}</div>
          <div className="urdu text-xs text-gold">{unit.labelUr}</div>
        </div>
      ))}
    </div>
  );
}
