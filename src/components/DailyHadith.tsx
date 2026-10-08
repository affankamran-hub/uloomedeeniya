import { useState } from "react";
import { BookMarked, Copy, Check, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type HadithItem = {
  arabic: string;
  urdu: string;
  english: string;
  source: string;
  topic: string;
  topicUr: string;
};

const HADITH_COLLECTION: HadithItem[] = [
  {
    topic: "Virtue of Seeking Knowledge",
    topicUr: "علم دین حاصل کرنے کی فضیلت",
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    urdu: "جو شخص علمِ دین کی تلاش میں کسی راستے پر چلتا ہے، اللہ تعالیٰ اس کی برکت سے اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔",
    english: "Whoever takes a path upon which to obtain knowledge, Allah makes the path to Paradise easy for him.",
    source: "Sahih Muslim: 2699",
  },
  {
    topic: "Excellence of Learning the Qur'an",
    topicUr: "قرآن سیکھنے اور سکھانے کی فضیلت",
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    urdu: "تم میں سب سے بہتر وہ شخص ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔",
    english: "The best among you are those who learn the Qur'an and teach it to others.",
    source: "Sahih al-Bukhari: 5027",
  },
  {
    topic: "Action upon Pure Knowledge",
    topicUr: "اخلاص اور علم پر عمل",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    urdu: "اعمال کا دارومدار نیتوں پر ہے، اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔",
    english: "Actions are judged by motives (intentions), and each person will be rewarded according to their intention.",
    source: "Sahih al-Bukhari: 1",
  },
];

export function DailyHadith() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const item = HADITH_COLLECTION[index] ?? HADITH_COLLECTION[0]!;

  const copyText = () => {
    const text = `Hadith of the Day (${item.source}):\n\n"${item.arabic}"\n\nاردو: ${item.urdu}\n\nEnglish: ${item.english}\n\n— Ma'had al-Uloom (Tauheed Trust, Karachi)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Hadith copied to clipboard! Share with family & friends / حدیث کاپی ہو گئی");
    setTimeout(() => setCopied(false), 2000);
  };

  const nextHadith = () => {
    setIndex((prev) => (prev + 1) % HADITH_COLLECTION.length);
  };

  return (
    <Card className="card-soft border-gold/40 bg-card shadow-md overflow-hidden">
      <CardHeader className="bg-muted/40 pb-3 border-b border-border/60">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BookMarked className="size-5 text-gold" />
            <CardTitle className="text-lg font-bold">
              Hadith of the Day <span className="urdu text-primary font-normal">حدیثِ مبارکہ</span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {item.topic} • {item.topicUr}
            </Badge>
            <Button size="sm" variant="ghost" onClick={nextHadith} className="h-7 text-xs text-muted-foreground hover:text-foreground">
              Next / اگلی →
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <p className="text-center font-amiri text-2xl font-medium leading-loose text-foreground dir-rtl py-2">
          {item.arabic}
        </p>
        <div className="border-t border-border/60 pt-3 space-y-2">
          <p className="urdu text-base leading-loose text-foreground/90">
            <strong>ترجمہ:</strong> {item.urdu}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Translation:</strong> {item.english}
          </p>
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="font-semibold text-primary">{item.source}</span>
          <Button size="sm" variant="outline" onClick={copyText} className="gap-1.5 h-8 text-xs">
            {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Share Hadith / کاپی کریں"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
