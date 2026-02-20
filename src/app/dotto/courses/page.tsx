export const dynamic = "force-dynamic";

import { fetchCourses } from "./actions";
import { CoursesPageClient } from "./CoursesPageClient";

export default async function CoursesPage() {
  const { courses } = await fetchCourses();

  return <CoursesPageClient courses={courses} />;
}
