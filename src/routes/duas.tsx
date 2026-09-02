import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Copy, Check, Sparkles, Heart, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/duas")({
  head: () => ({
    meta: [
      { title: "Daily Masnoon Duas & Adhkar | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content:
          "Authentic Masnoon Duas and Daily Adhkar for students of Uloom e Deeniya with Arabic text, Urdu translation, English meaning, and references.",
      },
      { property: "og:title", content: "Daily Masnoon Duas | Uloom e Deeniya" },
      {
        property: "og:description",
        content: "Authentic supplications from Qur'an and Sunnah taught at Ma'had al-Uloom.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DuasPage,
});

type Dua = {
  id: string;
  category: "knowledge" | "mosque" | "daily" | "forgiveness";
  titleEn: string;
  titleUr: string;
  arabic: string;
  urdu: string;
  english: string;
  source: string;
  countTarget?: number;
};

const DUAS: Dua[] = [
  {
    id: "knowledge-1",
    category: "knowledge",
    titleEn: "Dua for Beneficial Knowledge",
    titleUr: "نفع بخش علم کی دعا",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    urdu: "اے اللہ! میں تجھ سے نفع بخش علم، پاکیزہ رزق، اور قبول ہونے والے عمل کا سوال کرتا ہوں۔",
    english: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    source: "Sunan Ibn Majah: 925",
    countTarget: 1,
  },
  {
    id: "knowledge-2",
    category: "knowledge",
    titleEn: "Dua for Increase in Knowledge (Qur'an)",
    titleUr: "علم میں زیادتی کی قرآنی دعا",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    urdu: "اے میرے رب! میرے علم میں اضافہ فرما۔",
    english: "My Lord, increase me in knowledge.",
    source: "Surah Ta-Ha 20:114",
    countTarget: 3,
  },
  {
    id: "mosque-1",
    category: "mosque",
    titleEn: "Dua Entering the Mosque",
    titleUr: "مسجد میں داخل ہونے کی دعا",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    urdu: "اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔",
    english: "O Allah, open for me the doors of Your mercy.",
    source: "Sahih Muslim: 713",
    countTarget: 1,
  },
  {
    id: "mosque-2",
    category: "mosque",
    titleEn: "Dua Leaving the Mosque",
    titleUr: "مسجد سے نکلنے کی دعا",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    urdu: "اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔",
    english: "O Allah, I ask You from Your bounty.",
    source: "Sahih Muslim: 713",
    countTarget: 1,
  },
  {
    id: "daily-1",
    category: "daily",
    titleEn: "Protection Morning & Evening",
    titleUr: "صبح اور شام ہر نقصان سے حفاظت کی دعا",
    arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    urdu: "اللہ کے نام سے، جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی، اور وہی سب کچھ سننے والا، جاننے والا ہے۔",
    english: "In the Name of Allah, with Whose Name nothing on the earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
    source: "Sunan Abi Dawud: 5088 (Read 3 times morning & evening)",
    countTarget: 3,
  },
  {
    id: "forgiveness-1",
    category: "forgiveness",
    titleEn: "Sayyidul Istighfar (Chief of Supplications for Forgiveness)",
    titleUr: "سید الاستغفار — مغفرت کی سب سے بڑی دعا",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
    urdu: "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا اعتراف کرتا ہوں، پس مجھے بخش دے، کیونکہ تیرے سوا گناہوں کو کوئی نہیں بخش سکتا۔",
    english: "O Allah, You are my Lord, none has the right to be worshiped but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favors upon me and I acknowledge my sins, so forgive me, for none forgives sins except You.",
    source: "Sahih al-Bukhari: 6306",
    countTarget: 1,
  },
];

function DuaCard({ dua }: { dua: Dua }) {
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyDua = () => {
    const text = `${dua.titleEn} (${dua.titleUr})\n\n"${dua.arabic}"\n\nاردو: ${dua.urdu}\n\nEnglish: ${dua.english}\n\nReference: ${dua.source}\n— Uloom e Deeniya (Tauheed Trust)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Dua copied to clipboard! / دعا کاپی ہو گئی");
    setTimeout(() => setCopied(false), 2000);
  };

  const increment = () => {
    if (dua.countTarget && count >= dua.countTarget) {
      setCount(1);
    } else {
      setCount((c) => c + 1);
    }
  };

  const isCompleted = dua.countTarget && count >= dua.countTarget;

  return (
    <Card className="card-soft overflow-hidden border-border/80 transition-all hover:border-primary/50 shadow-sm">
      <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-base font-bold">{dua.titleEn}</CardTitle>
            <p className="urdu text-primary text-sm mt-0.5">{dua.titleUr}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {dua.source}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-center font-amiri text-2xl font-medium leading-loose text-foreground dir-rtl py-2">
          {dua.arabic}
        </p>
        <div className="space-y-2 border-t border-border/60 pt-3">
          <p className="urdu text-sm leading-loose text-foreground/90">
            <strong>ترجمہ:</strong> {dua.urdu}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>English:</strong> {dua.english}
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-border">
          <Button size="sm" variant="outline" onClick={copyDua} className="h-8 text-xs gap-1.5">
            {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy / شیئر کریں"}
          </Button>

          {dua.countTarget && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isCompleted ? "default" : "secondary"}
                onClick={increment}
                className={`h-8 text-xs font-mono font-bold ${
                  isCompleted ? "bg-green-600 hover:bg-green-700 text-white" : ""
                }`}
              >
                {isCompleted ? "✓ Completed" : `Recite: ${count} / ${dua.countTarget}`}
              </Button>
              {count > 0 && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setCount(0)}
                  title="Reset counter"
                  className="h-8 w-8"
                >
                  <RotateCcw className="size-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DuasPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredDuas = filter === "all" ? DUAS : DUAS.filter((d) => d.category === filter);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1">
            <Sparkles className="size-3.5" /> Adhkar &amp; Supplications / مسنون دعائیں
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">Authentic Masnoon Duas</h1>
          <p className="urdu text-2xl text-primary font-medium">قرآن و سنت کی مسنون دعائیں اور اذکار</p>
          <p className="text-sm text-muted-foreground">
            Essential daily supplications with authentic references from Sahih al-Bukhari and Muslim, taught to the students of Uloom e Deeniya.
          </p>
        </div>

        <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="mt-8">
          <div className="flex justify-center">
            <TabsList className="flex flex-wrap h-auto gap-1">
              <TabsTrigger value="all">All Duas / تمام دعائیں</TabsTrigger>
              <TabsTrigger value="knowledge">Seeking Knowledge / طلبِ علم</TabsTrigger>
              <TabsTrigger value="mosque">Mosque / مسجد</TabsTrigger>
              <TabsTrigger value="daily">Daily Protection / حفاظت</TabsTrigger>
              <TabsTrigger value="forgiveness">Forgiveness / استغفار</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={filter} className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredDuas.map((dua) => (
                <DuaCard key={dua.id} dua={dua} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}
