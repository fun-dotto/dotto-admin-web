"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type CancelledClass = components["schemas"]["AcademicService.CancelledClass"];
export type CancelledClassRequest = components["schemas"]["AcademicService.CancelledClassRequest"];

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

export async function createCancelledClass(
  request: CancelledClassRequest,
): Promise<{ cancelledClass?: CancelledClass; error?: string }> {
  const { data, error, response } = await api.POST("/v1/cancelledClasses", {
    body: request,
  });
  if (error || !data) {
    return { error: `休講の作成に失敗しました (${response.status})` };
  }
  return { cancelledClass: data.cancelledClass };
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
