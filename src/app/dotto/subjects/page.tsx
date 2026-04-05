export const dynamic = "force-dynamic";

import { fetchSubjects } from "./actions";
import { SubjectsPageClient } from "./SubjectsPageClient";
import type {
  Grade,
  Course,
  Class,
  CourseSemester,
  SubjectRequirementType,
  CulturalSubjectCategory,
} from "./constants";

interface SubjectsPageProps {
  searchParams: Promise<{
    q?: string;
    grades?: string;
    courses?: string;
    classes?: string;
    semesters?: string;
    requirementTypes?: string;
    culturalSubjectCategories?: string;
    searched?: string;
  }>;
}

function parseArrayParam<T extends string>(value?: string): T[] {
  if (!value) return [];
  return value.split(",").filter(Boolean) as T[];
}

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const grades = parseArrayParam<Grade>(params.grades);
  const courses = parseArrayParam<Course>(params.courses);
  const classes = parseArrayParam<Class>(params.classes);
  const semesters = parseArrayParam<CourseSemester>(params.semesters);
  const requirementTypes = parseArrayParam<SubjectRequirementType>(params.requirementTypes);
  const culturalSubjectCategories = parseArrayParam<CulturalSubjectCategory>(params.culturalSubjectCategories);
  const hasSearched = params.searched === "1";

  const { subjects } = hasSearched
    ? await fetchSubjects({ q: query || undefined, grades, courses, classes, semesters, requirementTypes, culturalSubjectCategories })
    : { subjects: [] as never[] };

  return (
    <SubjectsPageClient
      subjects={subjects}
      initialQuery={query}
      initialGrades={grades}
      initialCourses={courses}
      initialClasses={classes}
      initialSemesters={semesters}
      initialRequirementTypes={requirementTypes}
      initialCulturalSubjectCategories={culturalSubjectCategories}
      hasSearched={hasSearched}
    />
  );
}
