export const dynamic = "force-dynamic";

import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { TimetablePageClient } from "./TimetablePageClient";

export default async function TimetablePage() {
  const currentYear = new Date().getFullYear();
  const { subjects, error } = await fetchSubjects();

  return (
    <TimetablePageClient
      initialItems={[]}
      initialYear={currentYear}
      subjects={subjects}
      error={error}
    />
  );
}
