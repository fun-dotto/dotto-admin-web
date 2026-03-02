export const dynamic = "force-dynamic";

import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { NewCourseRegistrationPageClient } from "./NewCourseRegistrationPageClient";

export default async function NewCourseRegistrationPage() {
  const { subjects } = await fetchSubjects();

  return <NewCourseRegistrationPageClient subjects={subjects} />;
}
