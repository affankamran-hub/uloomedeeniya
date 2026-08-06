import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { QuizList } from "@/components/QuizSection";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quizzes | Uloom e Deeniya, Tauheed Trust" },
      {
        name: "description",
        content: "Short quizzes for every subject and grade of Uloom e Deeniya — answer online and earn points.",
      },
      { property: "og:title", content: "Quizzes | Uloom e Deeniya" },
      { property: "og:description", content: "Answer quizzes online and climb the student leaderboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <QuizList
          kind="quiz"
          titleEn="Quizzes"
          titleUr="کوئز"
          intro="Short questions set by your teachers. Every correct answer adds points to the leaderboard."
        />
      </div>
    </SiteLayout>
  ),
});