import type { components } from "@/types/openapi";

export type TimetableItem =
  components["schemas"]["AcademicService.TimetableItem"];
export type TimetableItemRequest =
  components["schemas"]["AcademicService.TimetableItemRequest"];

export type DayOfWeek = components["schemas"]["DottoFoundationV1.DayOfWeek"];
export type Period = components["schemas"]["DottoFoundationV1.Period"];
export type CourseSemester =
  components["schemas"]["DottoFoundationV1.CourseSemester"];
export enum TimetableSemester {
  spring = "spring",
  fall = "fall",
}

export const DAY_OF_WEEK_VALUES: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DAY_OF_WEEK_LABEL: Record<DayOfWeek, string> = {
  Sunday: "日",
  Monday: "月",
  Tuesday: "火",
  Wednesday: "水",
  Thursday: "木",
  Friday: "金",
  Saturday: "土",
};

export const PERIOD_VALUES: Period[] = [
  "Period1",
  "Period2",
  "Period3",
  "Period4",
  "Period5",
  "Period6",
];

export const PERIOD_LABEL: Record<Period, string> = {
  Period1: "1限",
  Period2: "2限",
  Period3: "3限",
  Period4: "4限",
  Period5: "5限",
  Period6: "6限",
};

export const SEMESTER_VALUES: CourseSemester[] = [
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "H1",
  "H2",
  "AllYear",
  "SummerIntensive",
  "WinterIntensive",
];

export const SEMESTER_LABEL: Record<CourseSemester, string> = {
  AllYear: "通年",
  H1: "前期",
  H2: "後期",
  Q1: "第1クォーター",
  Q2: "第2クォーター",
  Q3: "第3クォーター",
  Q4: "第4クォーター",
  SummerIntensive: "夏季集中",
  WinterIntensive: "冬季集中",
};

export const TIMETABLE_SEMESTER_LABEL: Record<TimetableSemester, string> = {
  [TimetableSemester.spring]: "前期",
  [TimetableSemester.fall]: "後期",
};

export const TIMETABLE_SEMESTER_VALUES: TimetableSemester[] = [
  TimetableSemester.spring,
  TimetableSemester.fall,
];

export const TIMETABLE_SEMESTER_TO_SEMESTERS: Record<
  TimetableSemester,
  CourseSemester[]
> = {
  [TimetableSemester.spring]: [
    "H1",
    "AllYear",
    "Q1",
    "Q2",
    "SummerIntensive",
  ],
  [TimetableSemester.fall]: [
    "H2",
    "AllYear",
    "Q3",
    "Q4",
    "WinterIntensive",
  ],
};
