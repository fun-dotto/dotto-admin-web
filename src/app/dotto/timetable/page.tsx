export const dynamic = "force-dynamic";

import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { DEFAULT_ACADEMIC_YEAR } from "@/lib/academic-year";
import { TimetablePageClient } from "./TimetablePageClient";

export default async function TimetablePage() {
  const { subjects, error } = await fetchSubjects();

  return (
    <TimetablePageClient
      initialItems={[]}
      initialYear={DEFAULT_ACADEMIC_YEAR}
      subjects={subjects}
      error={error}
    />
  );
}
