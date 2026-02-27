"use server";

import { api } from "@/lib/api";
import type { Subject, SubjectRequest } from "./constants";

export async function fetchSubjects(): Promise<{
  subjects: Subject[];
  error?: string;
}> {
  const { data, error } = await api.GET("/v1/subjects");
  if (error) {
    return { subjects: [], error: "科目の取得に失敗しました" };
  }
  return { subjects: data.subjects };
}

export async function fetchSubject(
  id: string,
): Promise<{ subject?: Subject; error?: string }> {
  const { data, error } = await api.GET("/v1/subjects/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "科目の取得に失敗しました" };
  }
  return { subject: data.subject };
}

export async function createSubject(
  request: SubjectRequest,
): Promise<{ subject?: Subject; error?: string }> {
  const { data, error } = await api.POST("/v1/subjects", {
    body: request,
  });
  if (error) {
    return { error: "科目の作成に失敗しました" };
  }
  return { subject: data.subject };
}

export async function updateSubject(
  id: string,
  request: SubjectRequest,
): Promise<{ subject?: Subject; error?: string }> {
  const { data, error } = await api.PUT("/v1/subjects/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error) {
    return { error: "科目の更新に失敗しました" };
  }
  return { subject: data.subject };
}

export async function deleteSubject(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/subjects/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "科目の削除に失敗しました" };
  }
  return { success: true };
}
