"use server";

import { api } from "@/lib/api";
import type { Room, RoomRequest } from "./constants";

export async function fetchRooms(): Promise<{
  rooms: Room[];
  error?: string;
}> {
  const { data, error } = await api.GET("/v1/facility/rooms");
  if (error) {
    return { rooms: [], error: "教室の取得に失敗しました" };
  }
  return { rooms: data.rooms };
}

export async function fetchRoom(
  id: string,
): Promise<{ room?: Room; error?: string }> {
  const { data, error } = await api.GET("/v1/facility/rooms/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "教室の取得に失敗しました" };
  }
  return { room: data.room };
}

export async function createRoom(
  request: RoomRequest,
): Promise<{ room?: Room; error?: string }> {
  const { data, error } = await api.POST("/v1/facility/rooms", {
    body: request,
  });
  if (error) {
    return { error: "教室の作成に失敗しました" };
  }
  return { room: data.room };
}

export async function updateRoom(
  id: string,
  request: RoomRequest,
): Promise<{ room?: Room; error?: string }> {
  const { data, error } = await api.PUT("/v1/facility/rooms/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error) {
    return { error: "教室の更新に失敗しました" };
  }
  return { room: data.room };
}

export async function deleteRoom(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/facility/rooms/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "教室の削除に失敗しました" };
  }
  return { success: true };
}
