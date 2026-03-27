export const dynamic = "force-dynamic";

import { fetchTimetableItems } from "./actions";
import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { TimetablePageClient } from "./TimetablePageClient";

export default async function TimetablePage() {
  const [timetableResult, subjectsResult] = await Promise.all([
    fetchTimetableItems("Q1"),
    fetchSubjects(),
  ]);

  return (
    <TimetablePageClient
      initialItems={timetableResult.items}
      subjects={subjectsResult.subjects}
    />
  );
}
