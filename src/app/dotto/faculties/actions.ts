"use server";

import { api } from "@/lib/api";
import type { Faculty, FacultyRequest } from "./constants";

export async function fetchFaculties(): Promise<{
  faculties: Faculty[];
  error?: string;
}> {
  const { data, error, response } = await api.GET("/v1/faculties");
  if (error || !data) {
    return {
      faculties: [],
      error: `教員の取得に失敗しました (${response.status})`,
    };
  }
  return { faculties: data.faculties };
}

export async function fetchFaculty(
  id: string,
): Promise<{ faculty?: Faculty; error?: string }> {
  const { data, error, response } = await api.GET("/v1/faculties/{id}", {
    params: { path: { id } },
  });
  if (error || !data) {
    return { error: `教員の取得に失敗しました (${response.status})` };
  }
  return { faculty: data.faculty };
}

export async function createFaculty(
  request: FacultyRequest,
): Promise<{ faculty?: Faculty; error?: string }> {
  const { data, error, response } = await api.POST("/v1/faculties", {
    body: request,
  });
  if (error || !data) {
    return { error: `教員の作成に失敗しました (${response.status})` };
  }
  return { faculty: data.faculty };
}

export async function updateFaculty(
  id: string,
  request: FacultyRequest,
): Promise<{ faculty?: Faculty; error?: string }> {
  const { data, error, response } = await api.PUT("/v1/faculties/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error || !data) {
    return { error: `教員の更新に失敗しました (${response.status})` };
  }
  return { faculty: data.faculty };
}

export async function deleteFaculty(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/faculties/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `教員の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
