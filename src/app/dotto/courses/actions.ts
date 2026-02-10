"use server";

import { api } from "@/lib/api";
import type { Course, CourseRequest } from "./constants";

export async function fetchCourses(): Promise<{
  courses: Course[];
  error?: string;
}> {
  const { data, error } = await api.GET("/v1/courses");
  if (error) {
    return { courses: [], error: "コースの取得に失敗しました" };
  }
  return { courses: data.courses };
}

export async function fetchCourse(
  id: string,
): Promise<{ course?: Course; error?: string }> {
  const { data, error } = await api.GET("/v1/courses/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { error: "コースの取得に失敗しました" };
  }
  return { course: data.course };
}

export async function createCourse(
  request: CourseRequest,
): Promise<{ course?: Course; error?: string }> {
  const { data, error } = await api.POST("/v1/courses", {
    body: request,
  });
  if (error) {
    return { error: "コースの作成に失敗しました" };
  }
  return { course: data.course };
}

export async function updateCourse(
  id: string,
  request: CourseRequest,
): Promise<{ course?: Course; error?: string }> {
  const { data, error } = await api.PUT("/v1/courses/{id}", {
    params: { path: { id } },
    body: request,
  });
  if (error) {
    return { error: "コースの更新に失敗しました" };
  }
  return { course: data.course };
}

export async function deleteCourse(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await api.DELETE("/v1/courses/{id}", {
    params: { path: { id } },
  });
  if (error) {
    return { success: false, error: "コースの削除に失敗しました" };
  }
  return { success: true };
}
