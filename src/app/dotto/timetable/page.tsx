export const dynamic = "force-dynamic";

import { fetchTimetableItems } from "./actions";
import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { TimetablePageClient } from "./TimetablePageClient";
import { TimetableSemester } from "./constants";

export default async function TimetablePage() {
  const currentYear = new Date().getFullYear();
  const [timetableResult, subjectsResult] = await Promise.all([
    fetchTimetableItems(currentYear, TimetableSemester.spring),
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
