import type { components } from "@/types/openapi";

export type DayOfWeekTimetableSlot = components["schemas"]["SubjectService.DayOfWeekTimetableSlot"];
export type DayOfWeekTimetableSlotRequest = components["schemas"]["SubjectService.DayOfWeekTimetableSlotRequest"];

export type DayOfWeek = components["schemas"]["DottoFoundationV1.DayOfWeek"];
export type TimetableSlot = components["schemas"]["DottoFoundationV1.TimetableSlot"];

export const DAY_OF_WEEK_LABEL: Record<DayOfWeek, string> = {
  Sunday: "日曜",
  Monday: "月曜",
  Tuesday: "火曜",
  Wednesday: "水曜",
  Thursday: "木曜",
  Friday: "金曜",
  Saturday: "土曜",
};

export const DAY_OF_WEEK_OPTIONS: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const TIMETABLE_SLOT_LABEL: Record<TimetableSlot, string> = {
  Slot1: "1限",
  Slot2: "2限",
  Slot3: "3限",
  Slot4: "4限",
  Slot5: "5限",
  Slot6: "6限",
};

export const TIMETABLE_SLOT_OPTIONS: TimetableSlot[] = [
  "Slot1",
  "Slot2",
  "Slot3",
  "Slot4",
  "Slot5",
  "Slot6",
];
