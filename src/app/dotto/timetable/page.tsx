export const dynamic = "force-dynamic";

import { fetchTimetableItems } from "./actions";
import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { TimetablePageClient } from "./TimetablePageClient";

export default async function TimetablePage() {
  const currentYear = new Date().getFullYear();
  const [timetableResult, subjectsResult] = await Promise.all([
    fetchTimetableItems(currentYear, "H1"),
    fetchSubjects(),
  ]);

  return (
    <TimetablePageClient
      initialItems={timetableResult.items}
      initialYear={currentYear}
      subjects={subjectsResult.subjects}
    />
  );
}
