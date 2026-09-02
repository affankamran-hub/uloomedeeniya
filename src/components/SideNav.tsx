import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  ListOrdered,
  MessageSquare,
  PlayCircle,
  Trophy,
  UserRound,
  ShieldCheck,
  Heart,
  Award,
} from "lucide-react";

export type NavItem = {
  to: string;
  en: string;
  ur: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const PRIMARY_NAV: NavItem[] = [
  { to: "/", en: "Home", ur: "صفحۂ اول", icon: BookOpen },
  { to: "/grades", en: "Grades", ur: "درجات", icon: GraduationCap },
  { to: "/results", en: "Results", ur: "نتائج", icon: Award },
  { to: "/resources", en: "Resources", ur: "مواد", icon: FileText },
  { to: "/events", en: "Events", ur: "پروگرام", icon: CalendarDays },
];

export const SIDE_NAV: NavItem[] = [
  { to: "/results", en: "Exam Results", ur: "امتحانی نتائج", icon: Award },
  { to: "/duas", en: "Masnoon Duas", ur: "دعائیں", icon: Heart },
  { to: "/quiz", en: "Quiz", ur: "کوئز", icon: ListOrdered },
  { to: "/tests", en: "Tests", ur: "امتحانات", icon: ClipboardList },
  { to: "/assignments", en: "Assignments", ur: "مشقیں", icon: FileText },
  { to: "/lectures", en: "Recorded Lectures", ur: "دروس", icon: PlayCircle },
  { to: "/leaderboard", en: "Leaderboard", ur: "فہرست", icon: Trophy },
  { to: "/messages", en: "Messages", ur: "پیغامات", icon: MessageSquare },
];

export function SideNavLinks({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-primary"
        >
          <item.icon className="size-4 shrink-0" />
          <span className="flex-1">{item.en}</span>
          <span className="urdu text-xs text-muted-foreground">{item.ur}</span>
        </Link>
      ))}
    </>
  );
}

export function SideNav({
  user,
  isAdmin,
}: {
  user: boolean;
  isAdmin: boolean;
}) {
  const items = [...SIDE_NAV];
  if (user) items.push({ to: "/profile", en: "Profile", ur: "پروفائل", icon: UserRound });
  if (isAdmin) items.push({ to: "/admin", en: "Admin", ur: "انتظامیہ", icon: ShieldCheck });

  return (
    <aside className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-60 shrink-0 overflow-y-auto border-e border-border bg-card/60 px-3 py-6 lg:block">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Learning
      </p>
      <nav className="flex flex-col gap-1">
        <SideNavLinks items={items} />
      </nav>
    </aside>
  );
}