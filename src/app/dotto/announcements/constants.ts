import type { components } from "@/types/openapi";

export type Announcement = components["schemas"]["AnnouncementService.Announcement"];
export type AnnouncementRequest = components["schemas"]["AnnouncementService.AnnouncementRequest"];

export type AnnouncementStatus = "active" | "upcoming" | "expired";

export function getAnnouncementStatus(announcement: Announcement): AnnouncementStatus {
  const now = new Date();
  const from = new Date(announcement.availableFrom);
  if (now < from) return "upcoming";
  if (announcement.availableUntil) {
    const until = new Date(announcement.availableUntil);
    if (now > until) return "expired";
  }
  return "active";
}

export const STATUS_LABEL: Record<AnnouncementStatus, string> = {
  active: "公開中",
  upcoming: "公開予定",
  expired: "終了",
};

export const STATUS_BADGE_VARIANT: Record<AnnouncementStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  upcoming: "secondary",
  expired: "outline",
};
