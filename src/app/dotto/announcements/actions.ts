"use server";

import { api } from "@/lib/api";
import type { Announcement, AnnouncementRequest } from "./constants";

export async function fetchAnnouncements(): Promise<{
  announcements: Announcement[];
  error?: string;
}> {
  const { data, error } = await api.GET("/v1/announcements");
  if (error) {
    return { announcements: [], error: "おしらせの取得に失敗しました" };
  }
  return { announcements: data.announcements };
}

export async function fetchAnnouncement(
  id: string,
): Promise<{ announcement?: Announcement; error?: string }> {
  const { data, error } = await api.GET("/v1/announcements/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "おしらせの取得に失敗しました" };
  }
  return { announcement: data.announcement };
}

export async function createAnnouncement(
  request: AnnouncementRequest,
): Promise<{ announcement?: Announcement; error?: string }> {
  const { data, error, response } = await api.POST("/v1/announcements", {
    body: request,
  });
  if (error) {
    return { error: "おしらせの作成に失敗しました" };
  }
  return { announcement: data.announcement };
}

export async function updateAnnouncement(
  id: string,
  request: AnnouncementRequest,
): Promise<{ announcement?: Announcement; error?: string }> {
  const { data, error } = await api.PUT("/v1/announcements/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error) {
    return { error: "おしらせの更新に失敗しました" };
  }
  return { announcement: data.announcement };
}

export async function deleteAnnouncement(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/announcements/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "おしらせの削除に失敗しました" };
  }
  return { success: true };
}
