"use server";

import { api } from "@/lib/api";
import type { User } from "./constants";

export async function fetchUser(
  id: string,
): Promise<{ user?: User; error?: string }> {
  const { data, error } = await api.GET("/v1/user/users/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "ユーザーの取得に失敗しました" };
  }
  return { user: data.user };
}
