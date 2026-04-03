"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type FCMToken = components["schemas"]["UserService.FCMToken"];

interface ListFilters {
  userIds?: string[];
  tokens?: string[];
  updatedAtFrom?: string;
  updatedAtTo?: string;
}

export async function fetchFCMTokens(
  filters?: ListFilters,
): Promise<{ fcmTokens: FCMToken[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/fcmTokens", {
    params: { query: filters ?? {} },
  });
  if (error || !data) {
    return {
      fcmTokens: [],
      error: `FCMトークン一覧の取得に失敗しました (${response.status})`,
    };
  }
  return { fcmTokens: data.fcmTokens };
}
