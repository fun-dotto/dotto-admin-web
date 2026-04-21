import { navigationSections } from "@/lib/navigation";

type TitleRule = {
  pattern: RegExp;
  title: string;
};

const baseTitles = new Map<string, string>([
  ["/", "ホーム"],
]);

for (const section of navigationSections) {
  for (const item of section.items) {
    baseTitles.set(item.href, item.title);
  }
}

const overrideRules: TitleRule[] = [
  { pattern: /^\/dotto\/announcements\/new$/, title: "おしらせを作成" },
  { pattern: /^\/dotto\/announcements\/[^/]+\/edit$/, title: "おしらせを編集" },
  { pattern: /^\/dotto\/faculties\/new$/, title: "教員を作成" },
  { pattern: /^\/dotto\/faculties\/[^/]+\/edit$/, title: "教員を編集" },
  { pattern: /^\/dotto\/subjects\/new$/, title: "科目の新規作成" },
  { pattern: /^\/dotto\/subjects\/[^/]+$/, title: "科目詳細" },
  { pattern: /^\/dotto\/facility-rooms\/new$/, title: "教室を作成" },
  { pattern: /^\/dotto\/facility-rooms\/[^/]+\/edit$/, title: "教室を編集" },
  { pattern: /^\/dotto\/faculty-rooms\/new$/, title: "教員室を作成" },
  { pattern: /^\/dotto\/timetable\/new$/, title: "時間割を作成" },
  { pattern: /^\/dotto\/cancelled-classes\/new$/, title: "休講を作成" },
  { pattern: /^\/dotto\/makeup-classes\/new$/, title: "補講を作成" },
  { pattern: /^\/dotto\/room-changes\/new$/, title: "教室変更を作成" },
  { pattern: /^\/dotto\/course-registrations\/new$/, title: "履修情報を作成" },
  { pattern: /^\/dotto\/notifications\/new$/, title: "通知を作成" },
  { pattern: /^\/dotto\/notifications\/[^/]+\/edit$/, title: "通知を編集" },
];

export function resolvePageTitle(pathname: string): string {
  for (const rule of overrideRules) {
    if (rule.pattern.test(pathname)) {
      return rule.title;
    }
  }
  return baseTitles.get(pathname) ?? "";
}
