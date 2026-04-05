"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type RoomChange = components["schemas"]["AcademicService.RoomChange"];
export type RoomChangeRequest = components["schemas"]["AcademicService.RoomChangeRequest"];

interface ListFilters {
  subjectIds?: string[];
  from?: string;
  until?: string;
}

export async function fetchRoomChanges(
  filters?: ListFilters,
): Promise<{ roomChanges: RoomChange[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/roomChanges", {
    params: { query: filters ?? {} },
  });
  if (error || !data) {
    return {
      roomChanges: [],
      error: `教室変更一覧の取得に失敗しました (${response.status})`,
    };
  }
  return { roomChanges: data.roomChanges };
}

export async function fetchFromAcademicSystem(): Promise<{
  fetched: RoomChange[];
  error?: string;
}> {
  const { data, error, response } = await api.PUT("/v1/roomChanges");
  if (error || !data) {
    return { fetched: [], error: `教室変更の取得に失敗しました (${response.status})` };
  }
  return { fetched: data.roomChanges };
}

export async function createRoomChange(
  request: RoomChangeRequest,
): Promise<{ roomChange?: RoomChange; error?: string }> {
  const { data, error, response } = await api.POST("/v1/roomChanges", {
    body: request,
  });
  if (error || !data) {
    return { error: `教室変更の作成に失敗しました (${response.status})` };
  }
  return { roomChange: data.roomChange };
}

export async function deleteRoomChange(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/roomChanges/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: `教室変更の削除に失敗しました (${response.status})` };
  }
  return { success: true };
}
