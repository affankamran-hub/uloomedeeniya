export const SITE = {
  org: { en: "Tauheed Trust", ur: "توحید ٹرسٹ" },
  organizer: { en: "Ma'had al-Uloom", ur: "معھدالعلوم" },
  institute: { en: "Uloom e Deeniya", ur: "علوم دینیہ" },
  address: {
    en: "Rafa e Aam Society, Malir Halt, Karachi — near Masjid e Tauheed, Rafa e Aam",
    ur: "رفاہ عام سوسائٹی، ملیر ہالٹ، کراچی — مسجدِ توحید رفاہ عام کے قریب",
    mapsUrl: "https://maps.app.goo.gl/MZoq5aQCAjxgFHwP6",
  },
  links: [
    { label: "www.emanekhalis.com", href: "https://www.emanekhalis.com" },
    { label: "www.therealislam.com", href: "https://www.therealislam.com" },
  ],
};

export const SUBJECTS = [
  {
    key: "tafheem",
    en: "Tafheem ud Din",
    ur: "تفہیم الدین",
    meaning: "Understanding of religion",
    detail:
      "You learn to understand the Qur'an deeply — its themes, commands and wisdom — so that faith is built on knowledge rather than habit.",
    detailUr:
      "یہاں آپ قرآن کو گہرائی سے سمجھنا سیکھتے ہیں — اس کے مضامین، احکام اور حکمت، تاکہ ایمان علم کی بنیاد پر ہو۔",
  },
  {
    key: "usool",
    en: "Usool e Hadith",
    ur: "اصول حدیث",
    meaning: "Rules of Hadith (sayings of the Prophet ﷺ)",
    detail:
      "You learn how hadith are classified and arranged, how chains of narration are examined, and how to distinguish an authentic report from a weak or fabricated one.",
    detailUr:
      "یہاں آپ احادیث کی تقسیم و ترتیب، سند کی جانچ، اور صحیح و ضعیف یا موضوع روایت میں فرق کرنا سیکھتے ہیں۔",
  },
  {
    key: "lughat",
    en: "Lughat ul Arabia",
    ur: "لغت العربی",
    meaning: "Dictionary of Arabic",
    detail:
      "You learn Arabic vocabulary and word roots so the words of the Qur'an and hadith become familiar and can be read without depending on translation.",
    detailUr:
      "یہاں آپ عربی الفاظ اور ان کے مادّے سیکھتے ہیں تاکہ قرآن و حدیث کے الفاظ ترجمے کے سہارے کے بغیر سمجھ آ سکیں۔",
  },
  {
    key: "tajweed",
    en: "Tajweed ul Qur'an",
    ur: "تجوید القرآن",
    meaning: "Correct pronunciation of the words of the Qur'an",
    detail:
      "You learn to bring out each letter from its proper articulation point with correct rules of elongation, stopping and clarity, so the Qur'an is recited as it was revealed.",
    detailUr:
      "یہاں آپ ہر حرف کو اس کے مخرج سے ادا کرنا، مدّ، وقف اور صفات کے قواعد سیکھتے ہیں تاکہ تلاوت درست ہو۔",
  },
  {
    key: "tarjuma",
    en: "Tarjumat ul Qur'an",
    ur: "ترجمہ القرآن",
    meaning: "Translation of the Qur'an",
    detail:
      "You learn word-by-word translation of the Qur'an, connecting grammar and vocabulary so the meaning of each verse is clear during recitation and salah.",
    detailUr:
      "یہاں آپ قرآن کا لفظی ترجمہ سیکھتے ہیں تاکہ تلاوت اور نماز میں ہر آیت کا مفہوم واضح ہو۔",
  },
] as const;

export const GRADES = [
  { n: 1, en: "Grade One", ur: "درجہ اولیٰ" },
  { n: 2, en: "Grade Two", ur: "درجہ ثانی" },
  { n: 3, en: "Grade Three", ur: "درجہ ثالثہ" },
  { n: 4, en: "Grade Four", ur: "درجہ الرابع" },
  { n: 5, en: "Grade Five", ur: "درجہ خامس" },
] as const;

export const CATEGORIES = [
  { key: "resource", en: "Resources", ur: "مواد" },
  { key: "assignment", en: "Assignments", ur: "مشقیں" },
  { key: "test", en: "Tests", ur: "امتحانات" },
  { key: "lecture", en: "Recorded Lectures", ur: "ریکارڈ شدہ دروس" },
  { key: "event", en: "Upcoming Events", ur: "آئندہ پروگرام" },
] as const;

export const subjectName = (key?: string | null) =>
  SUBJECTS.find((s) => s.key === key) ?? null;
