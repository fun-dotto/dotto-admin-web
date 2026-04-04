import type { components } from "@/types/openapi";

export type Subject = components["schemas"]["AcademicService.Subject"];
export type SubjectSummary = Subject;
export type SubjectTargetClass = components["schemas"]["AcademicService.SubjectTargetClass"];
export type SubjectRequirement = components["schemas"]["AcademicService.SubjectRequirement"];

export type Course = components["schemas"]["DottoFoundationV1.Course"];
export type CourseSemester = components["schemas"]["DottoFoundationV1.CourseSemester"];
export type Grade = components["schemas"]["DottoFoundationV1.Grade"];
export type Class = components["schemas"]["DottoFoundationV1.Class"];
export type SubjectRequirementType = components["schemas"]["DottoFoundationV1.SubjectRequirementType"];

export const COURSE_LABEL: Record<Course, string> = {
  InformationSystem: "情報システム",
  InformationDesign: "情報デザイン",
  AdvancedICT: "高度ICT",
  ComplexSystem: "複雑系",
  IntelligentSystem: "知能システム",
};

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

export const GRADE_LABEL: Record<Grade, string> = {
  B1: "B1",
  B2: "B2",
  B3: "B3",
  B4: "B4",
  M1: "M1",
  M2: "M2",
  D1: "D1",
  D2: "D2",
  D3: "D3",
};

export const CLASS_LABEL: Record<Class, string> = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  H: "H",
  I: "I",
  J: "J",
  K: "K",
  L: "L",
};

export const REQUIREMENT_TYPE_LABEL: Record<SubjectRequirementType, string> = {
  Required: "必修",
  Optional: "選択",
  OptionalRequired: "選択必修",
};
