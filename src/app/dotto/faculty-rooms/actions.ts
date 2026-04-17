"use server";

import { api } from "@/lib/api";
import type { FacultyRoom, FacultyRoomRequest } from "./constants";

export async function fetchFacultyRooms(year?: number): Promise<{
  facultyRooms: FacultyRoom[];
  error?: string;
}> {
  const query = year !== undefined ? { year } : {};
  const { data, error, response } = await api.GET("/v1/facultyRooms", {
    params: { query },
  });
  if (error || !data) {
    return {
      facultyRooms: [],
      error: `教員室の取得に失敗しました (${response.status})`,
    };
  }
  return { facultyRooms: data.facultyRooms };
}

export async function createFacultyRoom(
  request: FacultyRoomRequest,
): Promise<{ facultyRoom?: FacultyRoom; error?: string }> {
  const { data, error, response } = await api.POST("/v1/facultyRooms", {
    body: request,
  });
  if (error || !data) {
    return { error: `教員室の作成に失敗しました (${response.status})` };
  }
  return { facultyRoom: data.facultyRoom };
}

export async function deleteFacultyRoom(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/facultyRooms/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `教員室の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
