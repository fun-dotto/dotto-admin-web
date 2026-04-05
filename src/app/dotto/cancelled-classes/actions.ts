"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type CancelledClass = components["schemas"]["AcademicService.CancelledClass"];

interface ListFilters {
  subjectIds?: string[];
  from?: string;
  until?: string;
}

export async function fetchCancelledClasses(
  filters?: ListFilters,
): Promise<{ cancelledClasses: CancelledClass[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/cancelledClasses", {
    params: { query: filters ?? {} },
  });
  if (error || !data) {
    return {
      cancelledClasses: [],
      error: `休講一覧の取得に失敗しました (${response.status})`,
    };
  }
  return { cancelledClasses: data.cancelledClasses };
}

export async function fetchFromAcademicSystem(): Promise<{
  fetched: CancelledClass[];
  error?: string;
}> {
  const { data, error, response } = await api.PUT("/v1/cancelledClasses");
  if (error || !data) {
    return { fetched: [], error: `休講の取得に失敗しました (${response.status})` };
  }
  return { fetched: data.cancelledClasses };
}

export async function deleteCancelledClass(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/cancelledClasses/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: `休講の削除に失敗しました (${response.status})` };
  }
  return { success: true };
}
