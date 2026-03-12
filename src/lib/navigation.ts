import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  DoorOpen,
  Megaphone,
  UserRound,
  UserSearch,
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
    title: "Announcement",
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
    title: "Academic",
    items: [
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
        title: "教室",
        description: "",
        href: "/dotto/facility-rooms",
        icon: DoorOpen,
      },
      {
        title: "時間割",
        description: "",
        href: "/dotto/timetable",
        icon: Calendar,
      },
      {
        title: "履修",
        description: "",
        href: "/dotto/course-registrations",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Funch",
    items: [],
  },
  {
    title: "User",
    items: [
      {
        title: "ユーザー",
        description: "",
        href: "/dotto/users",
        icon: UserSearch,
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
