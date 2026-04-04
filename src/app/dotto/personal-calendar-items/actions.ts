"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type PersonalCalendarItem =
  components["schemas"]["AcademicService.PersonalCalendarItem"];

export async function fetchPersonalCalendarItems(
  userId: string,
  dates: string[],
): Promise<{ items: PersonalCalendarItem[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/personalCalendarItems", {
    params: { query: { userId, dates } },
  });
  console.log("[personal-calendar-items] request url:", response.url);
  if (error || !data) {
    return {
      items: [],
      error: `個人カレンダーの取得に失敗しました (${response.status})`,
    };
  }
  return { items: data.personalCalendarItems };
}
