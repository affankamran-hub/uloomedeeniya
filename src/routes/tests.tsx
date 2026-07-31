import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryPage } from "@/components/ContentSection";

export const Route = createFileRoute("/tests")({
  head: () => ({
    meta: [
      { title: "Tests | Uloom e Deeniya, Tauheed Trust" },
      { name: "description", content: "Test schedules, syllabus and results for every grade of the institute." },
      { property: "og:title", content: "Tests | Uloom e Deeniya, Tauheed Trust" },
      { property: "og:description", content: "Test schedules, syllabus and results for every grade of the institute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteLayout>
      <CategoryPage category="test" titleEn="Tests" titleUr="امتحانات" intro="Test schedules, syllabus and results for every grade of the institute." />
    </SiteLayout>
  ),
});
