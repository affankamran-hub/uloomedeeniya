import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const AskInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `You are the helper of the website "Uloom e Deeniya" (علوم دینیہ), a free religious education programme
organised by Ma'had al-Uloom (معھدالعلوم) under Tauheed Trust, held at Rafa e Aam Society, Malir Halt, Karachi,
near Masjid e Tauheed Rafa e Aam.

Facts:
- There are absolutely no fees. Knowledge is given in the way of Allah.
- Five subjects: Tafheem ud Din (understanding of religion and creed), Usool e Hadith (Hadith sciences and authentication),
  Lughat ul Arabia (Arabic grammar and vocabulary), Tajweed ul Qur'an (phonetics and correct recitation), Tarjumat ul Qur'an (word-by-word translation).
- Five grades: Grade 1 (درجہ اولیٰ) to Grade 5 (درجہ خامس).
- Core Books available on website:
  1. Grade 1 Tafheem ud Din Coursebook (PDF)
  2. Grade 1 Tajweed ul Qur'an — Darussalam Qurani Qaida by Qari Muhammad Idris al-Asim (PDF)
  3. Grade 1 Usool e Hadith Manual (PDF)
- Venue & Address: Rafa e Aam Society, Malir Halt, Karachi (near Masjid e Tauheed). Google Maps: https://maps.app.goo.gl/MZoq5aQCAjxgFHwP6
- Next Class Session: Sunday, 6 September 2026 at 8:00 AM PKT. Weekly reinforcement: Saturday after Zuhr at Masjid e Tauheed.
- Examination Results: Official Grade 1 Midterm results are published on the website at /results with full marksheet PDF.
- Competition: Whoever remains at the top of the leaderboard will win a surprise treat from the owner of the website!
- Official websites: www.emanekhalis.com and www.therealislam.com.`;

function generateKnowledgeResponse(question: string): string {
  const q = question.toLowerCase();
  const isUrdu = /[\u0600-\u06FF]/.test(question);

  // 1. Leaderboard & Competition & Treat
  if (
    q.includes("leaderboard") ||
    q.includes("treat") ||
    q.includes("prize") ||
    q.includes("reward") ||
    q.includes("انعام") ||
    q.includes("لیڈر") ||
    q.includes("دعوت") ||
    q.includes("جیت")
  ) {
    if (isUrdu) {
      return `🏆 **لیڈر بورڈ خصوصی مقابلہ:**\n\nجو طالبِ علم ویب سائٹ کے لیڈر بورڈ میں سب سے اوپر (پہلی پوزیشن پر) رہے گا، اسے ویب سائٹ کے مالک کی جانب سے **خصوصی سرپرائز دعوت (Surprise Treat)** دی جائے گی!\n\nآپ کوئز، ٹیسٹ اور اسائنمنٹس مکمل کر کے زیادہ سے زیادہ پوائنٹس حاصل کر سکتے ہیں۔ موجودہ پوزیشن دیکھنے کے لیے [لیڈر بورڈ صفحہ](/leaderboard) دیکھیں۔`;
    }
    return `🏆 **Leaderboard Challenge & Special Reward:**\n\n**“Whoever remains at the top of the leaderboard will win a surprise treat from the owner of the website!”**\n\nYou can earn points by attempting interactive quizzes, tests, and assignments. Visit the [Leaderboard](/leaderboard) to check current rankings!`;
  }

  // 2. Results & Exam
  if (
    q.includes("result") ||
    q.includes("exam") ||
    q.includes("marks") ||
    q.includes("امتحان") ||
    q.includes("نتائج") ||
    q.includes("پوزیشن") ||
    q.includes("نمبر") ||
    q.includes("رزلٹ")
  ) {
    if (isUrdu) {
      return `📊 **امتحانی نتائج (الدرجۃ الاولیٰ — ششماہی امتحان):**\n\nدرجہ اولیٰ ملیر زون کے ششماہی امتحانی نتائج ویب سائٹ کے [نتائج سیکشن](/results) پر جاری ہو چکے ہیں۔\n- **پہلی پوزیشن:** معاویہ راشد (241 / 250 — 96.4% ممتاز)\n- **دوسری پوزیشن:** عفان کامران (232 / 250 — 92.8% ممتاز)\n- **تیسری پوزیشن:** ابراہیم خالد ولد خالد عزیز (232 / 250 — 92.8% ممتاز)\n\nآپ ویب سائٹ پر اپنا رول نمبر یا نام تلاش کر سکتے ہیں اور مکمل [اصل رزلٹ شیٹ PDF](/results-grade-1-midterm.pdf) بھی ڈاؤنلوڈ کر سکتے ہیں۔`;
    }
    return `📊 **Midterm Examination Results (Grade 1):**\n\nOfficial results for Grade 1 (Malir Zone) are live on our [Results Portal](/results)!\n- **1st Position:** Muawiya Rashid (241 / 250 — 96.4% Distinction)\n- **2nd Position:** Affan Kamran (232 / 250 — 92.8% Distinction)\n- **3rd Position:** Ibrahim Khalid s/o Khalid Aziz (232 / 250 — 92.8% Distinction)\n\nYou can search your name or roll number and download the [Official PDF Marksheet](/results-grade-1-midterm.pdf).`;
  }

  // 3. Class timings & Countdown & Location
  if (
    q.includes("timing") ||
    q.includes("time") ||
    q.includes("class") ||
    q.includes("when") ||
    q.includes("location") ||
    q.includes("where") ||
    q.includes("address") ||
    q.includes("map") ||
    q.includes("وقت") ||
    q.includes("کب") ||
    q.includes("کہاں") ||
    q.includes("پتہ") ||
    q.includes("مقام") ||
    q.includes("کلاس") ||
    q.includes("درس")
  ) {
    if (isUrdu) {
      return `⏰ **کلاس کے اوقات اور مقامِ درس:**\n\n- **اگلی باقاعدہ کلاس:** اتوار، ۶ ستمبر ۲۰۲۶، صبح ۸:۰۰ بجے\n- **ہفتہ وار تقویتی کلاس:** ہر ہفتہ، نمازِ ظہر کے بعد\n- **مقام:** مسجدِ توحید، رفاہِ عام سوسائٹی، ملیر ہالٹ، کراچی\n- **گوگل میپس پر لوکیشن:** [Google Maps Directions](https://maps.app.goo.gl/MZoq5aQCAjxgFHwP6)\n\nادارے میں تمام تعلیم فی سبیل اللہ دی جاتی ہے اور کوئی فیس نہیں ہے۔`;
    }
    return `⏰ **Class Timings & Venue Location:**\n\n- **Next Session:** Sunday, 6 September 2026 at 8:00 AM PKT\n- **Weekly Reinforcement Class:** Every Saturday after Zuhr prayer\n- **Location:** Near Masjid e Tauheed, Rafa e Aam Society, Malir Halt, Karachi\n- **Google Maps Location:** [Open in Google Maps](https://maps.app.goo.gl/MZoq5aQCAjxgFHwP6)\n\nAll courses and materials are provided completely free in the way of Allah.`;
  }

  // 4. Books & Curriculum & PDFs
  if (
    q.includes("book") ||
    q.includes("pdf") ||
    q.includes("qaida") ||
    q.includes("download") ||
    q.includes("material") ||
    q.includes("کتاب") ||
    q.includes("قاعدہ") ||
    q.includes("نصاب") ||
    q.includes("مواد") ||
    q.includes("ڈاؤنلوڈ")
  ) {
    if (isUrdu) {
      return `📚 **درسی کتب اور نصابی کتب (PDFs):**\n\nویب سائٹ کے [کتب و مواد سیکشن](/resources) میں درجہ اولیٰ کی تمام کتب دستیاب ہیں:\n1. **دارالسلام قرآنی قاعدہ (تجوید القرآن):** [قاعدہ کھولیں](/tajweed-ul-quran-grade-1-qaida.pdf)\n2. **تفہیم الدین نصابی کتاب:** [کتاب کھولیں](/subject/tafheem)\n3. **اصول حدیث نصابی کتاب:** [کتاب کھولیں](/usool-e-hadith-grade-1.pdf)\n\nتمام کتب مفت مطالعے اور ڈاؤنلوڈ کے لیے دستیاب ہیں۔`;
    }
    return `📚 **Official Coursebooks & Study PDFs:**\n\nAvailable in our [Resources Section](/resources):\n1. **Darussalam Qurani Qaida (Tajweed ul Qur'an Grade 1):** [Open PDF](/tajweed-ul-quran-grade-1-qaida.pdf)\n2. **Tafheem ud Din Complete Coursebook:** [Open PDF](/subject/tafheem)\n3. **Usool e Hadith Grade 1 Manual:** [Open PDF](/usool-e-hadith-grade-1.pdf)\n\nAll textbooks are completely free to read online and download.`;
  }

  // 5. Subjects & Sciences
  if (
    q.includes("subject") ||
    q.includes("hadith") ||
    q.includes("tajweed") ||
    q.includes("tafheem") ||
    q.includes("lughat") ||
    q.includes("tarjuma") ||
    q.includes("مضمون") ||
    q.includes("مضامین") ||
    q.includes("حدیث") ||
    q.includes("تجوید") ||
    q.includes("تفہیم") ||
    q.includes("لغت") ||
    q.includes("ترجمہ")
  ) {
    if (isUrdu) {
      return `📖 **علوم دینیہ کے ۵ بنیادی مضامین:**\n\n1. **تفہیم الدین:** عقائد، اسلامی بصیرت اور فہمِ دین\n2. **اصول حدیث:** روایات کی تحقیق، سند و متن کے اصول اور جرح و تعدیل\n3. **لغت العربی:** عربی زبان، الفاظ کے معانی اور قواعد\n4. **تجوید القرآن:** مخارج الحروف اور صحیح قرآت\n5. **ترجمۃ القرآن:** قرآنی آیات کا فہم اور ترجمہ\n\nتفصیلات کے لیے [مضامین کا صفحہ](/grades) دیکھیں۔`;
    }
    return `📖 **The 5 Foundational Islamic Sciences Taught:**\n\n1. **Tafheem ud Din:** Understanding of creed, theology, and religious insight.\n2. **Usool e Hadith:** Classification of Hadith, Sanad, Matn, and authentication principles.\n3. **Lughat ul Arabia:** Arabic vocabulary, roots, and grammar.\n4. **Tajweed ul Qur'an:** Phonetics and proper articulation of Arabic letters.\n5. **Tarjumat ul Qur'an:** Direct word-by-word translation and meaning of the Qur'an.\n\nExplore full details under the [Curriculum Grades Page](/grades).`;
  }

  // 6. Registration & Approval & Login
  if (
    q.includes("register") ||
    q.includes("signup") ||
    q.includes("login") ||
    q.includes("approval") ||
    q.includes("account") ||
    q.includes("داخلہ") ||
    q.includes("رجسٹریشن") ||
    q.includes("اکاؤنٹ") ||
    q.includes("منظوری")
  ) {
    if (isUrdu) {
      return `🔐 **رجسٹریشن اور اکاؤنٹ کی منظوری:**\n\n1. [داخلہ صفحہ](/auth) پر جا کر اپنا نام، فون، مطلوبہ درجہ اور ای میل درج کر کے اکاؤنٹ بنائیں۔\n2. نئے اکاؤنٹس منتظمِ ادارہ (Admin) کی تصدیق تک زیرِ غور رہتے ہیں۔\n3. منظوری ملتے ہی آپ کے لیے کوئز، ٹیسٹ، اور تفصیلی درسی مواد فعال ہو جائے گا۔\n- **نوٹ:** لاگ ان کے لیے ای میل اور پاس ورڈ استعمال کریں۔`;
    }
    return `🔐 **Registration & Approval Process:**\n\n1. Go to the [Auth Page](/auth) and submit your registration with name, email, and grade.\n2. New accounts remain pending until approved by the institute's administration.\n3. Once approved, you can take quizzes, submit assignments, and chat with instructors.\n- **Tip:** Use standard Email & Password to log in or create an account instantly.`;
  }

  // 7. General Greetings / Default Fallback
  if (isUrdu) {
    return `وعلیکم السلام و رحمۃ اللہ و برکاتہ! 🌸\n\nمیں **علوم دینیہ (معھدالعلوم — توحید ٹرسٹ)** کا معاون ہوں۔ میں آپ کی ان امور میں رہنمائی کر سکتا ہوں:\n- کلاس کے اوقات اور مقامِ درس (مسجدِ توحید، رفاہِ عام، ملیر ہالٹ)\n- ۵ مضامین اور ۵ درجات کا نصاب\n- درسی کتب اور قرآنی قاعدہ ڈاؤنلوڈ کرنا\n- امتحانی نتائج (الدرجۃ الاولیٰ ملیر زون)\n- لیڈر بورڈ اور سرپرائز دعوت کا مقابلہ\n- اکاؤنٹ رجسٹریشن اور لاگ ان\n\nبراہ کرم اپنا سوال لکھیے!`;
  }

  return `Assalamu alaikum wa Rahmatullahi wa Barakatuh! 🌸\n\nI am the intelligent guide for **Uloom e Deeniya (Ma'had al-Uloom — Tauheed Trust)**. I can help you with:\n- Class schedules and venue location (Masjid e Tauheed, Rafa e Aam, Malir Halt)\n- The 5 subjects and 5 grade curricula\n- Downloading official textbooks (Tafheem, Darussalam Qaida, Usool e Hadith)\n- Grade 1 Midterm Exam Results\n- Leaderboard & Owner Treat Competition\n- Student registration and login assistance\n\nFeel free to ask me anything about the institute or website!`;
}

export const askAssistant = createServerFn({ method: "POST" })
  .validator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }) => {
    const userMessage = data.messages[data.messages.length - 1]?.content || "";

    // Check if an external LLM API key is provided
    const apiKey =
      process.env["GEMINI_API_KEY"] ||
      process.env["GOOGLE_GENERATIVE_AI_API_KEY"] ||
      process.env["OPENAI_API_KEY"] ||
      process.env["LOVABLE_API_KEY"];

    if (apiKey) {
      try {
        const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
        const { streamText } = await import("ai");
        const gateway = createLovableAiGatewayProvider(apiKey);
        const result = streamText({
          model: gateway("google/gemini-2.5-flash"),
          system: SYSTEM_PROMPT,
          messages: data.messages,
        });
        const text = await result.text;
        if (text && text.trim()) {
          return { text };
        }
      } catch (err) {
        console.warn("External AI call failed, falling back to instant knowledge engine:", err);
      }
    }

    // Always succeed with our intelligent institute knowledge engine!
    const responseText = generateKnowledgeResponse(userMessage);
    return { text: responseText };
  });