"use server";

import { api } from "@/lib/api";
import type { SubjectCategory, SubjectCategoryRequest } from "./constants";

export async function fetchSubjectCategories(): Promise<{
  subjectCategories: SubjectCategory[];
  error?: string;
}> {
  const { data, error } = await api.GET("/v1/subject-categories");
  if (error) {
    return { subjectCategories: [], error: "科目群・科目区分の取得に失敗しました" };
  }
  return { subjectCategories: data.subjectCategories };
}

export async function fetchSubjectCategory(
  id: string,
): Promise<{ subjectCategory?: SubjectCategory; error?: string }> {
  const { data, error } = await api.GET("/v1/subject-categories/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "科目群・科目区分の取得に失敗しました" };
  }
  return { subjectCategory: data.subjectCategory };
}

export async function createSubjectCategory(
  request: SubjectCategoryRequest,
): Promise<{ subjectCategory?: SubjectCategory; error?: string }> {
  const { data, error } = await api.POST("/v1/subject-categories", {
    body: request,
  });
  if (error) {
    return { error: "科目群・科目区分の作成に失敗しました" };
  }
  return { subjectCategory: data.subjectCategory };
}

export async function updateSubjectCategory(
  id: string,
  request: SubjectCategoryRequest,
): Promise<{ subjectCategory?: SubjectCategory; error?: string }> {
  const { data, error } = await api.PUT("/v1/subject-categories/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error) {
    return { error: "科目群・科目区分の更新に失敗しました" };
  }
  return { subjectCategory: data.subjectCategory };
}

export async function deleteSubjectCategory(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/subject-categories/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "科目群・科目区分の削除に失敗しました" };
  }
  return { success: true };
}
