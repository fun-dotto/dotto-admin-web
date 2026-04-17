import type { components } from "@/types/openapi";

export type MenuItem = components["schemas"]["FunchService.MenuItem"];
export type Category = components["schemas"]["FunchService.Category"];
export type Size = components["schemas"]["FunchService.Size"];
export type Price = components["schemas"]["FunchService.Price"];

export const CATEGORY_VALUES: Category[] = [
  "SetAndSingle",
  "BowlAndCurry",
  "Noodle",
  "Side",
  "Dessert",
];

export const CATEGORY_LABEL: Record<Category, string> = {
  SetAndSingle: "定食・単品",
  BowlAndCurry: "丼・カレー",
  Noodle: "麺類",
  Side: "サイド",
  Dessert: "デザート",
};

export const SIZE_VALUES: Size[] = ["Small", "Medium", "Large"];

export const SIZE_LABEL: Record<Size, string> = {
  Small: "小",
  Medium: "中",
  Large: "大",
};
