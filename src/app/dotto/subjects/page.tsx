export const dynamic = "force-dynamic";

import { fetchSubjects } from "./actions";
import { SubjectsPageClient } from "./SubjectsPageClient";

export default async function SubjectsPage() {
  const { subjects } = await fetchSubjects();

  return <SubjectsPageClient subjects={subjects} />;
}
