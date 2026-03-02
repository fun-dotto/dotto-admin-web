import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  DoorOpen,
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
    title: "教員",
    items: [
      {
        title: "教員",
        description: "",
        href: "/dotto/faculties",
        icon: UserRound,
      },
    ],
  },
  {
    title: "科目",
    items: [
      {
        title: "科目",
        description: "",
        href: "/dotto/subjects",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "教室",
    items: [
      {
        title: "教室",
        description: "",
        href: "/dotto/facility-rooms",
        icon: DoorOpen,
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
