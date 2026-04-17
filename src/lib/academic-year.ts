export enum AcademicYear {
  Y2025 = 2025,
  Y2026 = 2026,
  Y2027 = 2027,
}

export const ACADEMIC_YEAR_VALUES: AcademicYear[] = [
  AcademicYear.Y2025,
  AcademicYear.Y2026,
  AcademicYear.Y2027,
];

export const ACADEMIC_YEAR_LABEL: Record<AcademicYear, string> = {
  [AcademicYear.Y2025]: "2025年度",
  [AcademicYear.Y2026]: "2026年度",
  [AcademicYear.Y2027]: "2027年度",
};

export const DEFAULT_ACADEMIC_YEAR: AcademicYear = AcademicYear.Y2026;

export function isAcademicYear(value: number): value is AcademicYear {
  return ACADEMIC_YEAR_VALUES.includes(value as AcademicYear);
}
