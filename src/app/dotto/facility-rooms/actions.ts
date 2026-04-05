"use server";

import { api } from "@/lib/api";
import type { Room, RoomRequest, Floor } from "./constants";

export async function fetchRooms(filters?: {
  q?: string;
  floor?: Floor;
}): Promise<{
  rooms: Room[];
  error?: string;
}> {
  const query = {
    ...(filters?.q?.trim() ? { q: filters.q.trim() } : {}),
    ...(filters?.floor ? { floors: [filters.floor] } : {}),
  };
  const { data, error, response } = await api.GET("/v1/rooms", {
    params: { query },
    querySerializer: {
      array: { style: "form", explode: false },
    },
  });
  if (error || !data) {
    return {
      rooms: [],
      error: `教室の取得に失敗しました (${response.status})`,
    };
  }
  return { rooms: data.rooms };
}

export async function fetchRoom(
  id: string,
): Promise<{ room?: Room; error?: string }> {
  const { data, error, response } = await api.GET("/v1/rooms/{id}", {
    params: { path: { id } },
  });
  if (error || !data) {
    return { error: `教室の取得に失敗しました (${response.status})` };
  }
  return { room: data.room };
}

export async function createRoom(
  request: RoomRequest,
): Promise<{ room?: Room; error?: string }> {
  const { data, error, response } = await api.POST("/v1/rooms", {
    body: request,
  });
  if (error || !data) {
    return { error: `教室の作成に失敗しました (${response.status})` };
  }
  return { room: data.room };
}

export async function updateRoom(
  id: string,
  request: RoomRequest,
): Promise<{ room?: Room; error?: string }> {
  const { data, error, response } = await api.PUT("/v1/rooms/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error || !data) {
    return { error: `教室の更新に失敗しました (${response.status})` };
  }
  return { room: data.room };
}

export async function deleteRoom(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/rooms/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `教室の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
