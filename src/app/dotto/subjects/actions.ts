"use server";

import { api } from "@/lib/api";
import type { Subject, SubjectSummary } from "./constants";

export async function fetchSubjects(q?: string): Promise<{
  subjects: SubjectSummary[];
  error?: string;
}> {
  const query = q?.trim() ? { q: q.trim() } : {};
  const { data, error, response } = await api.GET("/v1/subjects", {
    params: { query },
  });
  if (error || !data) {
    return {
      subjects: [],
      error: `科目の取得に失敗しました (${response.status})`,
    };
  }
  return { subjects: data.subjects };
}

export async function fetchSubject(
  id: string,
): Promise<{ subject?: Subject; error?: string }> {
  const { data, error, response } = await api.GET("/v1/subjects/{id}", {
    params: { path: { id } },
  });
  if (error || !data) {
    return { error: `科目の取得に失敗しました (${response.status})` };
  }
  return { subject: data.subject };
}

export async function deleteSubject(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/subjects/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `科目の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
