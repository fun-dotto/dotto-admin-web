"use server";

import { api } from "@/lib/api";
import type { DayOfWeekTimetableSlot, DayOfWeekTimetableSlotRequest } from "./constants";

export async function fetchDayOfWeekTimetableSlots(): Promise<{
  dayOfWeekTimetableSlots: DayOfWeekTimetableSlot[];
  error?: string;
}> {
  const { data, error } = await api.GET("/v1/day-of-week-timetable-slots");
  if (error) {
    return { dayOfWeekTimetableSlots: [], error: "曜日・時限の取得に失敗しました" };
  }
  return { dayOfWeekTimetableSlots: data.dayOfWeekTimetableSlots };
}

export async function fetchDayOfWeekTimetableSlot(
  id: string,
): Promise<{ dayOfWeekTimetableSlot?: DayOfWeekTimetableSlot; error?: string }> {
  const { data, error } = await api.GET("/v1/day-of-week-timetable-slots/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "曜日・時限の取得に失敗しました" };
  }
  return { dayOfWeekTimetableSlot: data.dayOfWeekTimetableSlot };
}

export async function createDayOfWeekTimetableSlot(
  request: DayOfWeekTimetableSlotRequest,
): Promise<{ dayOfWeekTimetableSlot?: DayOfWeekTimetableSlot; error?: string }> {
  const { data, error } = await api.POST("/v1/day-of-week-timetable-slots", {
    body: request,
  });
  if (error) {
    return { error: "曜日・時限の作成に失敗しました" };
  }
  return { dayOfWeekTimetableSlot: data.dayOfWeekTimetableSlot };
}

export async function updateDayOfWeekTimetableSlot(
  id: string,
  request: DayOfWeekTimetableSlotRequest,
): Promise<{ dayOfWeekTimetableSlot?: DayOfWeekTimetableSlot; error?: string }> {
  const { data, error } = await api.PUT("/v1/day-of-week-timetable-slots/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error) {
    return { error: "曜日・時限の更新に失敗しました" };
  }
  return { dayOfWeekTimetableSlot: data.dayOfWeekTimetableSlot };
}

export async function deleteDayOfWeekTimetableSlot(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/day-of-week-timetable-slots/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "曜日・時限の削除に失敗しました" };
  }
  return { success: true };
}
