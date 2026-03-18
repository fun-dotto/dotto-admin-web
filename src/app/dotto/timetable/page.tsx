export const dynamic = "force-dynamic";

import { fetchTimetableItems } from "./actions";
import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { TimetablePageClient } from "./TimetablePageClient";
import { DAY_OF_WEEK_VALUES } from "./constants";

export default async function TimetablePage() {
  const [timetableResult, subjectsResult] = await Promise.all([
    fetchTimetableItems("Q1", DAY_OF_WEEK_VALUES),
    fetchSubjects(),
  ]);

  return (
    <TimetablePageClient
      initialItems={timetableResult.items}
      subjects={subjectsResult.subjects}
    />
  );
}
