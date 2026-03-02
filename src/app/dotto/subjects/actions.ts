"use server";

import { api } from "@/lib/api";
import type { Subject, SubjectSummary, SubjectRequest } from "./constants";

export async function fetchSubjects(): Promise<{
  subjects: SubjectSummary[];
  error?: string;
}> {
  const { data, error } = await api.GET("/v1/subject/subjects");
  if (error) {
    return { subjects: [], error: "科目の取得に失敗しました" };
  }
  return { subjects: data.subjects };
}

export async function fetchSubject(
  id: string,
): Promise<{ subject?: Subject; error?: string }> {
  const { data, error } = await api.GET("/v1/subject/subjects/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "科目の取得に失敗しました" };
  }
  return { subject: data.subject };
}

export async function upsertSubject(
  request: SubjectRequest,
): Promise<{ subject?: Subject; error?: string }> {
  const { data, error } = await api.POST("/v1/subject/subjects", {
    body: request,
  });
  if (error) {
    return { error: "科目の作成・更新に失敗しました" };
  }
  return { subject: data.subject };
}

export async function deleteSubject(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/subject/subjects/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "科目の削除に失敗しました" };
  }
  return { success: true };
}
