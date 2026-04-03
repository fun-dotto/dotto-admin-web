export const dynamic = "force-dynamic";

import { fetchSubjects } from "./actions";
import { SubjectsPageClient } from "./SubjectsPageClient";

interface SubjectsPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { subjects } = await fetchSubjects(query);

  return <SubjectsPageClient subjects={subjects} initialQuery={query} />;
}
