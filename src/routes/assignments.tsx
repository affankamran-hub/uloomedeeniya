import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryPage } from "@/components/ContentSection";

export const Route = createFileRoute("/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments | Uloom e Deeniya, Tauheed Trust" },
      { name: "description", content: "Weekly and monthly assignments given to students of each grade." },
      { property: "og:title", content: "Assignments | Uloom e Deeniya, Tauheed Trust" },
      { property: "og:description", content: "Weekly and monthly assignments given to students of each grade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteLayout>
      <CategoryPage category="assignment" titleEn="Assignments" titleUr="مشقیں" intro="Weekly and monthly assignments given to students of each grade." allowUpload />
    </SiteLayout>
  ),
});
