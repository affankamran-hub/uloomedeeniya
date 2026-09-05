import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  HandCoins,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  Check,
  Copy,
  Megaphone,
  ArrowRight,
  Compass,
  FileText,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.jpeg.asset.json";
import { SiteLayout } from "@/components/SiteLayout";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useAnnouncements } from "@/components/UpdatesDrawer";
import { SITE, SUBJECTS, GRADES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrayerTimes } from "@/components/PrayerTimes";
import { DailyHadith } from "@/components/DailyHadith";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uloom e Deeniya | Tauheed Trust Religious Education, Karachi" },
      {
        name: "description",
        content:
          "Free religious education at Masjid e Tauheed, Rafa e Aam Society, Malir Halt, Karachi. Five subjects, five grades, organised by Ma'had al-Uloom under Tauheed Trust.",
      },
      { property: "og:title", content: "Uloom e Deeniya | Tauheed Trust" },
      {
        property: "og:description",
        content: "Free Islamic studies classes in Malir Halt, Karachi — no fees, in the way of Allah.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: announcements } = useAnnouncements();
  const [copied, setCopied] = useState(false);
  const latestAnnouncement = announcements && announcements.length > 0 ? announcements[0] : null;

  const copyAddress = () => {
    navigator.clipboard.writeText(SITE.address.en);
    setCopied(true);
    toast.success("Address copied to clipboard! / پتہ کاپی ہو گیا");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SiteLayout>
      {/* Latest Announcement Bar (if available) */}
      {latestAnnouncement && (
        <div className="border-b border-gold/30 bg-gold/10 px-4 py-2.5 text-foreground">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1 bg-gold text-slate-950 hover:bg-gold/90">
                <Megaphone className="size-3" /> Latest Update / تازہ ترین اطلاع
              </Badge>
              <span className="font-medium text-foreground">{latestAnnouncement.title}</span>
              {latestAnnouncement.title_ur && (
                <span className="urdu hidden text-primary md:inline">({latestAnnouncement.title_ur})</span>
              )}
            </div>
            <Link
              to="/resources"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline"
            >
              View notices &amp; material <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-surface text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              <Sparkles className="size-3.5" /> {SITE.organizer.en} — {SITE.org.en}
            </div>
            <p className="urdu mt-2 text-xl text-gold">{SITE.organizer.ur} — {SITE.org.ur}</p>
            <h1 className="mt-3 text-4xl leading-tight font-bold md:text-5xl">
              {SITE.institute.en}
              <span className="urdu ms-3 block text-3xl font-normal text-gold md:inline md:text-4xl">
                {SITE.institute.ur}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/90 leading-relaxed">
              A structured, authentic curriculum of religious education organised by {SITE.organizer.en} under{" "}
              {SITE.org.en} — five subjects across five progressive grades, taught beside Masjid e Tauheed.
            </p>
            <p className="urdu mt-3 max-w-xl text-lg text-primary-foreground/90 leading-loose">
              دینی تعلیم کا منظم نصاب — پانچ مضامین، پانچ درجات، مسجدِ توحید رفاہ عام کے قریب۔
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold" className="font-semibold shadow-md">
                <Link to="/grades">Explore Grades / درجات</Link>
              </Button>
              <Button asChild size="lg" variant="onDark" className="font-medium">
                <Link to="/auth">Register / رجسٹریشن</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/resources">Study Material / کتب و مواد</Link>
              </Button>
            </div>
          </div>
          <div className="justify-self-center text-center">
            <div className="relative inline-block">
              <img
                src={logo.url}
                alt="Official logo of Tauheed Trust — Iman e Khalis"
                className="size-48 rounded-full ring-4 ring-gold/70 shadow-2xl transition-transform hover:scale-105 md:size-60"
              />
              <span className="absolute -bottom-2 inset-x-0 mx-auto w-fit rounded-full bg-background/90 px-3 py-0.5 text-[11px] font-semibold text-foreground shadow">
                Authentic Islamic Studies
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Next Class Countdown Section */}
      <section className="hero-surface border-y border-primary-foreground/10 py-12 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-2 text-gold">
            <Clock className="size-5" />
            <h2 className="text-xl font-semibold md:text-2xl">
              Next Class / اگلا درس
            </h2>
          </div>
          <p className="mt-2 max-w-3xl text-primary-foreground/85">
            Countdown to the upcoming session of Uloom e Deeniya classes:
          </p>
          <p className="urdu mt-1 max-w-3xl text-primary-foreground/85">
            علوم دینیہ کے اگلے سیشن کی باقی مدت:
          </p>
          <div className="mt-6">
            <CountdownTimer targetDate={new Date("2026-09-06T03:00:00.000Z")} />
          </div>
          <p className="mt-5 text-sm text-primary-foreground/80 font-medium">
            Sunday, 6 September 2026 at 8:00 AM Karachi time.
          </p>
          <p className="urdu mt-1 text-sm text-gold">
            اتوار، ۶ ستمبر ۲۰۲۶، صبح ۸:۰۰ بجے، کراچی کے وقت کے مطابق۔
          </p>

          <div className="mt-8 rounded-xl border border-gold/30 bg-primary-foreground/5 p-5 shadow-sm">
            <h3 className="text-lg font-medium text-gold">Weekly Reinforcement Class / تقویتی کلاس</h3>
            <p className="mt-2 text-primary-foreground/90">
              Every Saturday — after Zuhr prayer at Masjid e Tauheed, Rafa e Aam Society, Malir Halt, Karachi.
            </p>
            <p className="urdu mt-2 text-primary-foreground/90">
              ہر ہفتہ — نمازِ ظہر کے بعد، مسجدِ توحید، رفاہِ عام سوسائٹی، ملیر ہالٹ، کراچی۔
            </p>
          </div>
        </div>
      </section>

      {/* Daily Spiritual Guidance & Karachi Prayer Schedule */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <PrayerTimes />
          <DailyHadith />
        </div>
      </section>

      {/* Islamic Philosophy & Free Education Verse */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <Card className="card-soft border-gold/40 bg-secondary/50 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <HandCoins className="size-5" />
              <CardTitle className="text-xl">No fees — education in the way of Allah</CardTitle>
            </div>
            <p className="urdu text-lg text-primary">اللہ کے راستے میں تعلیم — کوئی فیس نہیں</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="urdu text-2xl font-normal leading-loose text-foreground">
              قُل لَّآ أَسْـَٔلُكُمْ عَلَيْهِ أَجْرًا إِنْ هُوَ إِلَّا ذِكْرَىٰ لِلْعَـٰلَمِينَ
            </p>
            <p className="text-sm font-medium text-foreground">
              “Say: I ask of you no reward for it; it is nothing but a reminder for all the worlds.”
              — Qur'an, Surah Al-An'am 6:90
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Prophet ﷺ said: “The best of you are those who learn the Qur'an and teach it.”
              — Sahih al-Bukhari 5027. Every class, textbook, assignment, and lecture is offered completely free of charge, seeking only the
              pleasure and reward of Allah.
            </p>
            <p className="urdu text-sm leading-loose text-muted-foreground">
              رسول اللہ ﷺ نے فرمایا: ”تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔“ (صحیح بخاری: ۵۰۲۷)۔ ادارہ میں تمام درجات اور کتب کی تدریس فی سبیل اللہ ہے۔
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Subjects Overview */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Subjects <span className="urdu text-primary">مضامین</span></h2>
            <p className="text-sm text-muted-foreground mt-1">Five foundational sciences taught comprehensively</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/resources">All Resources →</Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((s) => (
            <Link key={s.key} to="/subject/$key" params={{ key: s.key }} className="group block">
              <Card className="card-soft h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <BookOpen className="size-5 text-primary" />
                    <Badge variant="outline" className="text-xs group-hover:bg-primary group-hover:text-primary-foreground">
                      Explore
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{s.en}</CardTitle>
                  <p className="urdu text-lg text-primary">{s.ur}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">{s.meaning}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.detail}</p>
                  <p className="urdu text-sm leading-loose text-muted-foreground">{s.detailUr}</p>
                  <p className="pt-2 text-sm font-medium text-primary inline-flex items-center gap-1 group-hover:underline">
                    View syllabus &amp; materials <ArrowRight className="size-3.5" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Grades Overview */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-bold">Grades <span className="urdu text-primary">درجات</span></h2>
        <p className="text-sm text-muted-foreground mt-1">Select a grade to access its lessons, books, and assignments</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GRADES.map((g) => (
            <Link
              key={g.n}
              to="/grades"
              search={{ grade: g.n }}
              className="card-soft group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <GraduationCap className="size-6 text-primary" />
                <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary">Level {g.n}</span>
              </div>
              <p className="mt-4 font-semibold text-foreground">{g.en}</p>
              <p className="urdu text-base text-primary font-medium">{g.ur}</p>
              <p className="mt-2 text-xs text-muted-foreground">Access curriculum →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Official Websites Showcase */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-2xl border border-primary/20 bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Compass className="size-5" />
            <h2 className="text-xl font-bold">Official Websites of the Organization</h2>
          </div>
          <p className="urdu text-lg text-primary">ادارے کی سرکاری ویب سائٹس</p>
          <p className="text-sm text-muted-foreground mt-1">
            Access articles, research papers, Islamic books, and audio lectures published by Tauheed Trust:
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SITE.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-border bg-background p-5 transition-all hover:border-primary hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground group-hover:text-primary">{link.label}</span>
                    <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {link.label.includes("emanekhalis")
                      ? "Iman e Khalis — Official portal with Islamic articles, fatwas, books, and community guidance."
                      : "The Real Islam — Authentic Islamic research, prophetic guidance, and da'wah resources."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-medium text-primary">
                  <span>Visit website</span>
                  <span className="urdu text-muted-foreground">ویب سائٹ وزٹ کریں</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Special Competition & Owner Treat Banner */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="overflow-hidden rounded-2xl border-2 border-gold bg-gradient-to-br from-gold/20 via-amber-500/10 to-primary/10 p-6 md:p-8 shadow-xl ring-1 ring-gold/40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gold text-slate-950 shadow-md">
                <Trophy className="size-8" />
              </div>
              <div className="space-y-1.5">
                <Badge className="bg-gold text-slate-950 font-black text-xs uppercase tracking-wider">
                  🏆 Special Reward / خصوصی انعام
                </Badge>
                <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                  “Whoever remains at the top of the leaderboard will win a treat from the owner of the website!”
                </h3>
                <p className="urdu text-xl md:text-2xl font-bold text-primary leading-relaxed">
                  ”جو طالبِ علم لیڈر بورڈ میں سب سے اوپر (پہلی پوزیشن پر) رہے گا، اسے ویب سائٹ کے مالک کی جانب سے خصوصی دعوت (Treat) دی جائے گی!“
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Button asChild variant="gold" size="lg" className="font-bold shadow-md">
                <Link to="/leaderboard">Leaderboard / لیڈر بورڈ →</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/quiz">Attempt Quiz / کوئز دیں</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="card-soft overflow-hidden shadow-sm">
          <CardHeader className="bg-muted/30 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="size-5" />
                <CardTitle className="text-xl">Class Location &amp; Venue <span className="urdu font-normal">مقامِ درس</span></CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="gold" asChild className="gap-1.5 text-xs font-semibold shadow">
                  <a href={SITE.address.mapsUrl} target="_blank" rel="noreferrer">
                    <MapPin className="size-3.5" /> Open in Google Maps / نقشہ
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={copyAddress} className="gap-1.5 text-xs">
                  {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied" : "Copy Address"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">English Address</p>
                <p className="mt-1 text-sm font-medium text-foreground">{SITE.address.en}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Institute</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {SITE.institute.en} by {SITE.organizer.en} under {SITE.org.en}
                </p>
              </div>
              <div>
                <p className="urdu text-xs font-semibold uppercase tracking-wider text-muted-foreground">اردو پتہ</p>
                <p className="urdu mt-1 text-base font-medium text-foreground">{SITE.address.ur}</p>
                <p className="urdu mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ادارہ</p>
                <p className="urdu mt-1 text-sm text-muted-foreground">
                  {SITE.institute.ur} — زیرِ اہتمام {SITE.organizer.ur}، زیرِ نگرانی {SITE.org.ur}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
