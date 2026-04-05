export const dynamic = "force-dynamic";

import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { CourseRegistrationsPageClient } from "./CourseRegistrationsPageClient";

export default async function CourseRegistrationsPage() {
  const { subjects, error } = await fetchSubjects();

  return <CourseRegistrationsPageClient subjects={subjects} error={error} />;
}
