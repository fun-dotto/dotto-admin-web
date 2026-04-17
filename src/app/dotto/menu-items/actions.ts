"use server";

import { api } from "@/lib/api";
import type { MenuItem } from "./constants";

export async function fetchMenuItems(date: string): Promise<{
  menuItems: MenuItem[];
  error?: string;
}> {
  const { data, error, response } = await api.GET("/v1/menuItems", {
    params: { query: { date } },
  });
  if (error || !data) {
    return {
      menuItems: [],
      error: `メニューの取得に失敗しました (${response.status})`,
    };
  }
  return { menuItems: data.menuItems };
}
