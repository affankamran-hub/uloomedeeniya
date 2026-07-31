import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryPage } from "@/components/ContentSection";

export const Route = createFileRoute("/lectures")({
  head: () => ({
    meta: [
      { title: "Recorded Lectures | Uloom e Deeniya, Tauheed Trust" },
      { name: "description", content: "Recorded lessons of Tafheem ud Din, Usool e Hadith, Arabic, Tajweed and Qur'an translation." },
      { property: "og:title", content: "Recorded Lectures | Uloom e Deeniya, Tauheed Trust" },
      { property: "og:description", content: "Recorded lessons of Tafheem ud Din, Usool e Hadith, Arabic, Tajweed and Qur'an translation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteLayout>
      <CategoryPage category="lecture" titleEn="Recorded Lectures" titleUr="ریکارڈ شدہ دروس" intro="Recorded lessons of Tafheem ud Din, Usool e Hadith, Arabic, Tajweed and Qur'an translation." />
    </SiteLayout>
  ),
});
