export const SITE = {
  org: { en: "Tauheed Trust", ur: "توحید ٹرسٹ" },
  organizer: { en: "Ma'had al-Uloom", ur: "معھدالعلوم" },
  institute: { en: "Uloom e Deeniya", ur: "علوم دینیہ" },
  address: {
    en: "Rafa e Aam Society, Malir Halt, Karachi — near Masjid e Tauheed, Rafa e Aam",
    ur: "رفاہ عام سوسائٹی، ملیر ہالٹ، کراچی — مسجدِ توحید رفاہ عام کے قریب",
  },
  links: [
    { label: "www.emanekhalis.com", href: "https://www.emanekhalis.com" },
    { label: "www.therealislam.com", href: "https://www.therealislam.com" },
  ],
};

export const SUBJECTS = [
  { key: "tafheem", en: "Tafheem ud Din", ur: "تفہیم الدین", meaning: "Understanding of religion" },
  { key: "usool", en: "Usool e Hadith", ur: "اصول حدیث", meaning: "Rules of Hadith (sayings of the Prophet ﷺ)" },
  { key: "lughat", en: "Lughat ul Arabia", ur: "لغت العربی", meaning: "Dictionary of Arabic" },
  { key: "tajweed", en: "Tajweed ul Qur'an", ur: "تجوید القرآن", meaning: "Correct pronunciation of the words of the Qur'an" },
  { key: "tarjuma", en: "Tarjumat ul Qur'an", ur: "ترجمہ القرآن", meaning: "Translation of the Qur'an" },
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
