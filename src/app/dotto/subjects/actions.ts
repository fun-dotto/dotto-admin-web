"use server";

import { api } from "@/lib/api";
import type {
  Subject,
  SubjectSummary,
  Grade,
  Course,
  Class,
  CourseSemester,
  SubjectRequirementType,
  CulturalSubjectCategory,
} from "./constants";

export async function fetchSubjects(params?: {
  q?: string;
  grades?: Grade[];
  courses?: Course[];
  classes?: Class[];
  semesters?: CourseSemester[];
  requirementTypes?: SubjectRequirementType[];
  culturalSubjectCategories?: CulturalSubjectCategory[];
}): Promise<{
  subjects: SubjectSummary[];
  error?: string;
}> {
  const query: Record<string, unknown> = {};
  if (params?.q?.trim()) query.q = params.q.trim();
  if (params?.grades?.length) query.grades = params.grades;
  if (params?.courses?.length) query.courses = params.courses;
  if (params?.classes?.length) query.classes = params.classes;
  if (params?.semesters?.length) query.semesters = params.semesters;
  if (params?.requirementTypes?.length) query.requirementTypes = params.requirementTypes;
  if (params?.culturalSubjectCategories?.length) query.culturalSubjectCategories = params.culturalSubjectCategories;

  const { data, error, response } = await api.GET("/v1/subjects", {
    params: { query },
    querySerializer: {
      array: { style: "form", explode: false },
    },
  });
  if (error || !data) {
    return {
      subjects: [],
      error: `科目の取得に失敗しました (${response.status})`,
    };
  }
  return { subjects: data.subjects };
}

export async function fetchSubject(
  id: string,
): Promise<{ subject?: Subject; error?: string }> {
  const { data, error, response } = await api.GET("/v1/subjects/{id}", {
    params: { path: { id } },
  });
  if (error || !data) {
    return { error: `科目の取得に失敗しました (${response.status})` };
  }
  return { subject: data.subject };
}

export async function deleteSubject(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error, response } = await api.DELETE("/v1/subjects/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return {
      success: false,
      error: `科目の削除に失敗しました (${response.status})`,
    };
  }
  return { success: true };
}
