import type { components } from "@/types/openapi";
import {
  FilterSemester,
  FILTER_SEMESTER_LABEL,
  FILTER_SEMESTER_VALUES,
  FILTER_SEMESTER_TO_COURSE_SEMESTERS,
} from "@/lib/course-semester-filter";

export type Registration =
  components["schemas"]["AcademicService.CourseRegistration"];
export type RegistrationRequest =
  components["schemas"]["AcademicService.CourseRegistrationRequest"];

export type CourseSemester =
  components["schemas"]["DottoFoundationV1.CourseSemester"];
export { FilterSemester };

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

export const COURSE_REGISTRATION_FILTER_SEMESTER_LABEL =
  FILTER_SEMESTER_LABEL;
export const COURSE_REGISTRATION_FILTER_SEMESTER_VALUES =
  FILTER_SEMESTER_VALUES;
export const COURSE_REGISTRATION_FILTER_SEMESTER_TO_SEMESTERS =
  FILTER_SEMESTER_TO_COURSE_SEMESTERS;
