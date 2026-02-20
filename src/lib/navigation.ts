import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  FolderTree,
  GraduationCap,
  Megaphone,
  UserRound,
  Users,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    title: "Dotto",
    items: [
      {
        title: "おしらせ",
        description: "",
        href: "/dotto/announcements",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "科目",
    items: [
      {
        title: "コース",
        description: "",
        href: "/dotto/courses",
        icon: GraduationCap,
      },
      {
        title: "教員",
        description: "",
        href: "/dotto/faculties",
        icon: UserRound,
      },
      {
        title: "科目",
        description: "",
        href: "/dotto/subjects",
        icon: BookOpen,
      },
      {
        title: "科目群・科目区分",
        description: "",
        href: "/dotto/subject-categories",
        icon: FolderTree,
      },
      {
        title: "曜日・時限",
        description: "",
        href: "/dotto/day-of-week-timetable-slots",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Firebase",
    items: [
      {
        title: "ユーザー",
        description: "",
        href: "/firebase/users",
        icon: Users,
      },
    ],
  },
];
