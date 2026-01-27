export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];
export const DEFAULT_PAGE_SIZE: PageSize = 20;

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "admin", label: "管理者" },
  { value: "enabled", label: "有効" },
  { value: "disabled", label: "無効" },
  { value: "verified", label: "メール認証済" },
  { value: "unverified", label: "メール未認証" },
] as const;

export type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]["value"];
