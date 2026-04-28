export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "admin", label: "管理者" },
  { value: "developer", label: "開発者" },
  { value: "enabled", label: "有効" },
  { value: "disabled", label: "無効" },
  { value: "verified", label: "メール認証済" },
  { value: "unverified", label: "メール未認証" },
] as const;

export type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]["value"];

export const SORT_KEYS = [
  "displayName",
  "email",
  "uid",
  "creationTime",
  "lastSignInTime",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}
