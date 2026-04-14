import type { components } from "@/types/openapi";

export type Notification = components["schemas"]["UserService.Notification"];
export type NotificationRequest =
  components["schemas"]["UserService.NotificationRequest"];

export type NotificationStatus = "notified" | "pending";

export function getNotificationStatus(
  notification: Notification,
): NotificationStatus {
  return notification.isNotified ? "notified" : "pending";
}

export const STATUS_LABEL: Record<NotificationStatus, string> = {
  notified: "通知済み",
  pending: "未通知",
};

export const STATUS_BADGE_VARIANT: Record<
  NotificationStatus,
  "default" | "secondary" | "outline"
> = {
  notified: "default",
  pending: "secondary",
};
