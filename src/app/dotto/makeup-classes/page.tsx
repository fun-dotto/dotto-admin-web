export const dynamic = "force-dynamic";

import { fetchMakeupClasses } from "./actions";
import { MakeupClassesPageClient } from "./MakeupClassesPageClient";

interface MakeupClassesPageProps {
  searchParams: Promise<{
    subjectIds?: string;
    from?: string;
    until?: string;
    searched?: string;
  }>;
}

export default async function MakeupClassesPage({
  searchParams,
}: MakeupClassesPageProps) {
  const { subjectIds, from, until, searched } = await searchParams;
  const hasSearched = searched === "1";
  const parsedSubjectIds = (subjectIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { makeupClasses } = hasSearched
    ? await fetchMakeupClasses({
        ...(parsedSubjectIds.length > 0 ? { subjectIds: parsedSubjectIds } : {}),
        ...(from ? { from } : {}),
        ...(until ? { until } : {}),
      })
    : { makeupClasses: [] };

  return (
    <MakeupClassesPageClient
      makeupClasses={makeupClasses}
      initialSubjectIds={subjectIds ?? ""}
      initialFrom={from ?? ""}
      initialUntil={until ?? ""}
      hasSearched={hasSearched}
    />
  );
}
