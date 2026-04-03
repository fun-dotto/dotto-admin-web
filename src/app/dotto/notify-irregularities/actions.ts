"use server";

import { api } from "@/lib/api";

export async function notifyIrregularities(
  date: string,
  userIds?: string[],
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.POST("/v1/notifyIrregularities", {
    params: {
      query: {
        date,
        ...(userIds && userIds.length > 0 ? { userIds } : {}),
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: `イレギュラー通知に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
