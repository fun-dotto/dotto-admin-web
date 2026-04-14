import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  CalendarDays,
  ClipboardList,
  DoorOpen,
  DoorClosed,
  DoorOpen as DoorOpenIcon,
  BellRing,
  Ban,
  Wrench,
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
        title: "休講",
        description: "",
        href: "/dotto/cancelled-classes",
        icon: Ban,
      },
      {
        title: "補講",
        description: "",
        href: "/dotto/makeup-classes",
        icon: Wrench,
      },
      {
        title: "教室変更",
        description: "",
        href: "/dotto/room-changes",
        icon: DoorOpenIcon,
      },
      {
        title: "予約",
        description: "",
        href: "/dotto/reservations",
        icon: DoorClosed,
      },
      {
        title: "個人カレンダー",
        description: "",
        href: "/dotto/personal-calendar-items",
        icon: CalendarDays,
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
      {
        title: "通知",
        description: "",
        href: "/dotto/notifications",
        icon: BellRing,
      },
      {
        title: "FCMトークン",
        description: "",
        href: "/dotto/fcm-tokens",
        icon: BellRing,
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
