import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryPage } from "@/components/ContentSection";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Upcoming Events | Uloom e Deeniya, Tauheed Trust" },
      { name: "description", content: "Upcoming classes, admission sessions and gatherings at Masjid e Tauheed, Rafa e Aam." },
      { property: "og:title", content: "Upcoming Events | Uloom e Deeniya, Tauheed Trust" },
      { property: "og:description", content: "Upcoming classes, admission sessions and gatherings at Masjid e Tauheed, Rafa e Aam." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteLayout>
      <CategoryPage category="event" titleEn="Upcoming Events" titleUr="آئندہ پروگرام" intro="Upcoming classes, admission sessions and gatherings at Masjid e Tauheed, Rafa e Aam." />
    </SiteLayout>
  ),
});
