"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type PersonalCalendarItem =
  components["schemas"]["AcademicService.PersonalCalendarItem"];

export async function fetchPersonalCalendarItems(
  userId: string,
  dates: string[],
): Promise<{ items: PersonalCalendarItem[]; error?: string }> {
  const iso8601Dates = dates.map((date) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return `${date}T00:00:00+09:00`;
    }

    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? date : parsedDate.toISOString();
  });

  const { data, error, response } = await api.GET("/v1/personalCalendarItems", {
    params: { query: { userId, dates: iso8601Dates } },
  });
  if (error || !data) {
    return {
      items: [],
      error: `個人カレンダーの取得に失敗しました (${response.status})`,
    };
  }
  return { items: data.personalCalendarItems };
}
