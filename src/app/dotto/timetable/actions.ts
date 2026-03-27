"use server";

import { api } from "@/lib/api";
import type {
  TimetableItem,
  TimetableItemRequest,
  CourseSemester,
  DayOfWeek,
} from "./constants";

export async function fetchTimetableItems(
  semester: CourseSemester,
  dayOfWeek: DayOfWeek[],
): Promise<{ items: TimetableItem[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/timetableItmes", {
    params: { query: { semesters: [semester], dayOfWeek } },
  });
  if (error || !data) {
    return {
      items: [],
      error: `時間割の取得に失敗しました (${response.status})`,
    };
  }
  return { items: data.items };
}

export async function createTimetableItem(
  request: TimetableItemRequest,
): Promise<{ item?: TimetableItem; error?: string }> {
  const { data, error, response } = await api.POST("/v1/timetableItmes", {
    body: request,
  });
  if (error || !data) {
    return { error: `時間割の作成に失敗しました (${response.status})` };
  }
  return { item: data.item };
}

export async function deleteTimetableItem(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/timetableItmes/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `時間割の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
