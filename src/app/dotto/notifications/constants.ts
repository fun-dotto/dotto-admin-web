import type { components } from "@/types/openapi";

export type Notification = components["schemas"]["UserService.Notification"];
export type NotificationRequest =
  components["schemas"]["UserService.NotificationRequest"];

export type NotificationStatus = "pending" | "success" | "partial_failure";

export function getNotificationStatus(
  notification: Notification,
): NotificationStatus {
  const { targetUsers } = notification;
  if (targetUsers.length === 0) return "pending";

  const notifiedCount = targetUsers.filter((u) => u.notifiedAt).length;
  const total = targetUsers.length;

  if (notifiedCount === 0) return "pending";
  if (notifiedCount === total) return "success";
  return "partial_failure";
}

export const STATUS_LABEL: Record<NotificationStatus, string> = {
  pending: "未送信",
  success: "成功",
  partial_failure: "一部失敗",
};

export const STATUS_BADGE_CLASS: Record<NotificationStatus, string> = {
  pending: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  partial_failure:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
};
