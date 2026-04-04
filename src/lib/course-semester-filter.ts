import type { components } from "@/types/openapi";

export type CourseSemester =
  components["schemas"]["DottoFoundationV1.CourseSemester"];

export enum FilterSemester {
  spring = "spring",
  fall = "fall",
}

export const FILTER_SEMESTER_VALUES: FilterSemester[] = [
  FilterSemester.spring,
  FilterSemester.fall,
];

export const FILTER_SEMESTER_LABEL: Record<FilterSemester, string> = {
  [FilterSemester.spring]: "前期",
  [FilterSemester.fall]: "後期",
};

export const FILTER_SEMESTER_TO_COURSE_SEMESTERS: Record<
  FilterSemester,
  CourseSemester[]
> = {
  [FilterSemester.spring]: [
    "H1",
    "AllYear",
    "Q1",
    "Q2",
    "SummerIntensive",
  ],
  [FilterSemester.fall]: [
    "H2",
    "AllYear",
    "Q3",
    "Q4",
    "WinterIntensive",
  ],
};
