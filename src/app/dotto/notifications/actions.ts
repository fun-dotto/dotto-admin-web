"use server";

import { api } from "@/lib/api";
import type { Notification, NotificationRequest } from "./constants";

export interface NotificationFilters {
  notifyAtFrom?: string;
  notifyAtTo?: string;
  isNotified?: boolean;
}

export async function fetchNotifications(
  filters: NotificationFilters = {},
): Promise<{ notifications: Notification[]; error?: string }> {
  const query: NotificationFilters = {};
  if (filters.notifyAtFrom) query.notifyAtFrom = filters.notifyAtFrom;
  if (filters.notifyAtTo) query.notifyAtTo = filters.notifyAtTo;
  if (filters.isNotified !== undefined) query.isNotified = filters.isNotified;

  const { data, error, response } = await api.GET("/v1/notifications", {
    params: { query },
  });
  const status = response.status;
  if (error || !data) {
    return {
      notifications: [],
      error: `通知の取得に失敗しました (${status})`,
    };
  }
  return { notifications: data.notifications };
}

export async function createNotification(
  request: NotificationRequest,
): Promise<{ notification?: Notification; error?: string }> {
  const { data, error, response } = await api.POST("/v1/notifications", {
    body: request,
  });
  const status = response.status;
  if (error || !data) {
    return { error: `通知の作成に失敗しました (${status})` };
  }
  return { notification: data.notification };
}

export async function updateNotification(
  id: string,
  request: NotificationRequest,
): Promise<{ notification?: Notification; error?: string }> {
  const { data, error, response } = await api.PUT("/v1/notifications/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error || !data) {
    return { error: `通知の更新に失敗しました (${response.status})` };
  }
  return { notification: data.notification };
}

export async function deleteNotification(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/notifications/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `通知の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
