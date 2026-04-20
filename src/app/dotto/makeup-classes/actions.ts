"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type MakeupClass = components["schemas"]["AcademicService.MakeupClass"];
export type MakeupClassRequest = components["schemas"]["AcademicService.MakeupClassRequest"];

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

export async function createMakeupClass(
  request: MakeupClassRequest,
): Promise<{ makeupClass?: MakeupClass; error?: string }> {
  const { data, error, response } = await api.POST("/v1/makeupClasses", {
    body: request,
  });
  if (error || !data) {
    return { error: `補講の作成に失敗しました (${response.status})` };
  }
  return { makeupClass: data.makeupClass };
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
