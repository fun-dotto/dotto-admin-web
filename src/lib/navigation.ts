import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  CalendarX2,
  ClipboardList,
  DoorClosed,
  DoorOpen,
  KeyRound,
  LayoutGrid,
  Megaphone,
  Shuffle,
  UserRound,
  UserSearch,
  Users,
  UtensilsCrossed,
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
    title: "Academic",
    items: [
      {
        title: "教員",
        description: "",
        href: "/dotto/faculties",
        icon: UserRound,
      },
      {
        title: "教員室",
        description: "",
        href: "/dotto/faculty-rooms",
        icon: DoorClosed,
      },
      {
        title: "科目",
        description: "",
        href: "/dotto/subjects",
        icon: BookOpen,
      },
      {
        title: "部屋",
        description: "",
        href: "/dotto/facility-rooms",
        icon: DoorOpen,
      },
      {
        title: "履修",
        description: "",
        href: "/dotto/course-registrations",
        icon: ClipboardList,
      },
      {
        title: "時間割",
        description: "",
        href: "/dotto/timetable",
        icon: LayoutGrid,
      },
      {
        title: "休講",
        description: "",
        href: "/dotto/cancelled-classes",
        icon: CalendarX2,
      },
      {
        title: "補講",
        description: "",
        href: "/dotto/makeup-classes",
        icon: CalendarPlus,
      },
      {
        title: "教室変更",
        description: "",
        href: "/dotto/room-changes",
        icon: Shuffle,
      },
      {
        title: "予約",
        description: "",
        href: "/dotto/reservations",
        icon: CalendarCheck,
      },
      {
        title: "個人カレンダー",
        description: "",
        href: "/dotto/personal-calendar-items",
        icon: CalendarDays,
      },
    ],
  },
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
    title: "Funch",
    items: [
      {
        title: "メニュー",
        description: "",
        href: "/dotto/menu-items",
        icon: UtensilsCrossed,
      },
    ],
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
        icon: KeyRound,
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
