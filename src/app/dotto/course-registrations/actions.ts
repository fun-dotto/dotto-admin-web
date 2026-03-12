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
  const { data, error } = await api.GET("/v1/courseRegistrations", {
    params: { query: { userId, semester } },
  });
  if (error) {
    return { registrations: [], error: "履修情報の取得に失敗しました" };
  }
  return { registrations: data.registrations };
}

export async function createRegistration(
  request: RegistrationRequest,
): Promise<{ registration?: Registration; error?: string }> {
  const { data, error } = await api.POST("/v1/courseRegistrations", {
    body: request,
  });
  if (error) {
    return { error: "履修情報の作成に失敗しました" };
  }
  return { registration: data.registration };
}

export async function deleteRegistration(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/courseRegistrations/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "履修情報の削除に失敗しました" };
  }
  return { success: true };
}
