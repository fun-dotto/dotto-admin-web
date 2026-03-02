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
  const { data, error } = await api.GET("/v1/timetable/itmes", {
    params: { query: { semester, dayOfWeek } },
  });
  if (error) {
    return { items: [], error: "時間割の取得に失敗しました" };
  }
  return { items: data.items };
}

export async function createTimetableItem(
  request: TimetableItemRequest,
): Promise<{ item?: TimetableItem; error?: string }> {
  const { data, error } = await api.POST("/v1/timetable/itmes", {
    body: request,
  });
  if (error) {
    return { error: "時間割の作成に失敗しました" };
  }
  return { item: data.item };
}

export async function deleteTimetableItem(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/timetable/itmes/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "時間割の削除に失敗しました" };
  }
  return { success: true };
}
