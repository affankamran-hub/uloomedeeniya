import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryPage } from "@/components/ContentSection";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources | Uloom e Deeniya, Tauheed Trust" },
      { name: "description", content: "Books, notes and study material for all five subjects of Uloom e Deeniya." },
      { property: "og:title", content: "Resources | Uloom e Deeniya, Tauheed Trust" },
      { property: "og:description", content: "Books, notes and study material for all five subjects of Uloom e Deeniya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteLayout>
      <CategoryPage category="resource" titleEn="Resources" titleUr="مواد" intro="Books, notes and study material for all five subjects of Uloom e Deeniya." />
    </SiteLayout>
  ),
});
