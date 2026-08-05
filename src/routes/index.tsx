import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, HandCoins, MapPin, Clock } from "lucide-react";
import logo from "@/assets/logo.jpeg.asset.json";
import { SiteLayout } from "@/components/SiteLayout";
import { CountdownTimer } from "@/components/CountdownTimer";
import { SITE, SUBJECTS, GRADES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <SiteLayout>
      <section className="hero-surface text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="urdu text-lg text-gold">{SITE.organizer.ur} — {SITE.org.ur}</p>
            <h1 className="mt-2 text-4xl leading-tight md:text-5xl">
              {SITE.institute.en}
              <span className="urdu ms-3 block text-3xl text-gold md:inline md:text-4xl">
                {SITE.institute.ur}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/85">
              A structured course of religious education organised by {SITE.organizer.en} under{" "}
              {SITE.org.en} — five subjects across five grades, taught beside Masjid e Tauheed.
            </p>
            <p className="urdu mt-3 max-w-xl text-primary-foreground/85">
              دینی تعلیم کا منظم نصاب — پانچ مضامین، پانچ درجات، مسجدِ توحید رفاہ عام کے قریب۔
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <Link to="/grades">Explore Grades / درجات</Link>
              </Button>
              <Button asChild size="lg" variant="onDark">
                <Link to="/auth">Register / رجسٹریشن</Link>
              </Button>
            </div>
          </div>
          <div className="justify-self-center">
            <img
              src={logo.url}
              alt="Official logo of Tauheed Trust — Iman e Khalis"
              className="size-48 rounded-full ring-4 ring-gold/60 md:size-60"
            />
          </div>
        </div>
      </section>

      <section className="hero-surface border-y border-primary-foreground/10 py-12 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-2 text-gold">
            <Clock className="size-5" />
            <h2 className="text-xl md:text-2xl">
              Next Class / اگلا درس
            </h2>
          </div>
          <p className="mt-2 max-w-3xl text-primary-foreground/85">
            Countdown to the next session of Uloom e Deeniya:
          </p>
          <p className="urdu mt-1 max-w-3xl text-primary-foreground/85">
            علوم دینیہ کے اگلے سیشن کی باقی مدت:
          </p>
          <div className="mt-6">
            <CountdownTimer targetDate={new Date("2026-09-06T03:00:00.000Z")} />
          </div>
          <p className="mt-5 text-sm text-primary-foreground/80">
            Sunday, 6 September 2026 at 8:00 AM Karachi time.
          </p>
          <p className="urdu mt-1 text-sm text-gold">
            اتوار، ۶ ستمبر ۲۰۲۶، صبح ۸:۰۰ بجے، کراچی کے وقت کے مطابق۔
          </p>

          <div className="mt-8 rounded-xl border border-gold/30 bg-primary-foreground/5 p-5">
            <h3 className="text-lg text-gold">Unofficial Reinforcement Class / غیر سرکاری تقویتی کلاس</h3>
            <p className="mt-2 text-primary-foreground/90">
              11 August 2026, Saturday — after Zuhr prayer at Masjid e Tauheed, Rafah e Aam.
            </p>
            <p className="urdu mt-2 text-primary-foreground/90">
              ۱۱ اگست ۲۰۲۶، ہفتہ — نمازِ ظہر کے بعد، مسجدِ توحید، رفاہِ عام۔
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <Card className="card-soft border-gold/40 bg-secondary/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <HandCoins className="size-5" />
              <CardTitle className="text-xl">No fees — education in the way of Allah</CardTitle>
            </div>
            <p className="urdu text-lg text-primary">اللہ کے راستے میں تعلیم — کوئی فیس نہیں</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="urdu text-xl leading-loose text-foreground">
              قُل لَّآ أَسْـَٔلُكُمْ عَلَيْهِ أَجْرًا إِنْ هُوَ إِلَّا ذِكْرَىٰ لِلْعَـٰلَمِينَ
            </p>
            <p className="text-sm text-muted-foreground">
              “Say: I ask of you no reward for it; it is nothing but a reminder for all the worlds.”
              — Qur'an, Surah Al-An'am 6:90
            </p>
            <p className="text-sm text-muted-foreground">
              The Prophet ﷺ said: “The best of you are those who learn the Qur'an and teach it.”
              — Sahih al-Bukhari 5027. Every class here is offered free of charge, seeking only the
              pleasure of Allah.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl">Subjects <span className="urdu text-primary">مضامین</span></h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SUBJECTS.map((s) => (
            <Card key={s.key} className="card-soft">
              <CardHeader className="pb-2">
                <BookOpen className="size-5 text-primary" />
                <CardTitle className="mt-2 text-lg">{s.en}</CardTitle>
                <p className="urdu text-lg text-primary">{s.ur}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-foreground">{s.meaning}</p>
                <p className="text-sm text-muted-foreground">{s.detail}</p>
                <p className="urdu text-sm leading-loose text-muted-foreground">{s.detailUr}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl">Grades <span className="urdu text-primary">درجات</span></h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GRADES.map((g) => (
            <Link
              key={g.n}
              to="/grades"
              search={{ grade: g.n }}
              className="card-soft rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <GraduationCap className="size-5 text-primary" />
              <p className="mt-3 font-medium">{g.en}</p>
              <p className="urdu text-primary">{g.ur}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="card-soft">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="size-5" />
              <CardTitle className="text-xl">Class location <span className="urdu">مقامِ درس</span></CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-muted-foreground">
            <p>{SITE.address.en}</p>
            <p className="urdu text-foreground">{SITE.address.ur}</p>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  );
}
