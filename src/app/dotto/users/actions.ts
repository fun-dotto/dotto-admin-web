"use server";

import type { components } from "@/types/openapi";
import { api } from "@/lib/api";
import type { User } from "./constants";

type UserRequest = components["schemas"]["UserService.UserRequest"];

export async function fetchUsers(): Promise<{ users: User[]; error?: string }> {
  const { data, error, response } = await api.GET("/v1/users");
  if (error || !data) {
    return {
      users: [],
      error: `ユーザー一覧の取得に失敗しました (${response.status})`,
    };
  }
  return { users: data.users };
}

export async function fetchUser(
  id: string,
): Promise<{ user?: User; error?: string }> {
  const { data, error, response } = await api.GET("/v1/users/{id}", {
    params: { path: { id } },
  });
  if (error || !data) {
    return { error: `ユーザーの取得に失敗しました (${response.status})` };
  }
  return { user: data.user };
}

export async function upsertUser(
  id: string,
  request: UserRequest,
): Promise<{ user?: User; error?: string }> {
  const { data, error, response } = await api.POST("/v1/users/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error || !data) {
    return { error: `ユーザーの更新に失敗しました (${response.status})` };
  }
  return { user: data.user };
}
