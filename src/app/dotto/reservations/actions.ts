"use server";

import { api } from "@/lib/api";
import type { components } from "@/types/openapi";

export type Reservation = components["schemas"]["AcademicService.Reservation"];

interface ListFilters {
  roomIds?: string[];
  from?: string;
  until?: string;
}

export async function fetchReservations(
  filters?: ListFilters,
): Promise<{ reservations: Reservation[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/reservations", {
    params: { query: filters ?? {} },
    querySerializer: {
      array: { style: "form", explode: false },
    },
  });
  if (error || !data) {
    return {
      reservations: [],
      error: `予約一覧の取得に失敗しました (${response.status})`,
    };
  }
  return { reservations: data.reservations };
}

export async function deleteReservation(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/reservations/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: `予約の削除に失敗しました (${response.status})` };
  }
  return { success: true };
}
