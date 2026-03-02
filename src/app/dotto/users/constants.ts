import type { components } from "@/types/openapi";

export type User = components["schemas"]["UserService.User"];

export type Grade = components["schemas"]["DottoFoundationV1.Grade"];
export type Course = components["schemas"]["DottoFoundationV1.Course"];
export type Class = components["schemas"]["DottoFoundationV1.Class"];

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

export const COURSE_LABEL: Record<Course, string> = {
  InformationSystem: "情報システム",
  InformationDesign: "情報デザイン",
  AdvancedICT: "高度ICT",
  ComplexSystem: "複雑系",
  IntelligentSystem: "知能システム",
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
