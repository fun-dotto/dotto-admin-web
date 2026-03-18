export const dynamic = "force-dynamic";

import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { NewTimetableItemPageClient } from "./NewTimetableItemPageClient";

export default async function NewTimetableItemPage() {
  const subjectsResult = await fetchSubjects();

  return (
    <NewTimetableItemPageClient subjects={subjectsResult.subjects} />
  );
}
