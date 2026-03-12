import type { components } from "@/types/openapi";

export type Room = components["schemas"]["AcademicService.Room"];
export type RoomRequest = components["schemas"]["AcademicService.RoomRequest"];
export type Floor = components["schemas"]["DottoFoundationV1.Floor"];

export const FLOOR_VALUES: Floor[] = [
  "Floor1",
  "Floor2",
  "Floor3",
  "Floor4",
  "Floor5",
  "Floor6",
  "Floor7",
];

export const FLOOR_LABEL: Record<Floor, string> = {
  Floor1: "1階",
  Floor2: "2階",
  Floor3: "3階",
  Floor4: "4階",
  Floor5: "5階",
  Floor6: "6階",
  Floor7: "7階",
};
