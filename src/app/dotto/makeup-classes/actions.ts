"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type MakeupClass = components["schemas"]["AcademicService.MakeupClass"];

interface ListFilters {
  subjectIds?: string[];
  from?: string;
  until?: string;
}

export async function fetchMakeupClasses(
  filters?: ListFilters,
): Promise<{ makeupClasses: MakeupClass[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/makeupClasses", {
    params: { query: filters ?? {} },
  });
  if (error || !data) {
    return {
      makeupClasses: [],
      error: `補講一覧の取得に失敗しました (${response.status})`,
    };
  }
  return { makeupClasses: data.makeupClasses };
}

export async function fetchFromAcademicSystem(): Promise<{
  fetched: MakeupClass[];
  error?: string;
}> {
  const { data, error, response } = await api.PUT("/v1/makeupClasses");
  if (error || !data) {
    return { fetched: [], error: `補講の取得に失敗しました (${response.status})` };
  }
  return { fetched: data.makeupClasses };
}

export async function deleteMakeupClass(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/makeupClasses/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: `補講の削除に失敗しました (${response.status})` };
  }
  return { success: true };
}
