"use server";

import { api } from "@/lib/api";
import type {
  Registration,
  RegistrationRequest,
  CourseSemester,
} from "./constants";

export async function fetchRegistrations(
  userId: string,
  semester: CourseSemester,
): Promise<{ registrations: Registration[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/courseRegistrations", {
    params: { query: { userId, semesters: [semester] } },
  });
  if (error || !data) {
    return {
      registrations: [],
      error: `履修情報の取得に失敗しました (${response.status})`,
    };
  }
  return { registrations: data.registrations };
}

export async function createRegistration(
  request: RegistrationRequest,
): Promise<{ registration?: Registration; error?: string }> {
  const { data, error, response } = await api.POST("/v1/courseRegistrations", {
    body: request,
  });
  if (error || !data) {
    return { error: `履修情報の作成に失敗しました (${response.status})` };
  }
  return { registration: data.registration };
}

export async function deleteRegistration(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/courseRegistrations/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `履修情報の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
