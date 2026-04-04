export const dynamic = "force-dynamic";

import { fetchCancelledClasses } from "./actions";
import { CancelledClassesPageClient } from "./CancelledClassesPageClient";

interface CancelledClassesPageProps {
  searchParams: Promise<{
    subjectIds?: string;
    from?: string;
    until?: string;
    searched?: string;
  }>;
}

export default async function CancelledClassesPage({
  searchParams,
}: CancelledClassesPageProps) {
  const { subjectIds, from, until, searched } = await searchParams;
  const hasSearched = searched === "1";
  const parsedSubjectIds = (subjectIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { cancelledClasses } = hasSearched
    ? await fetchCancelledClasses({
        ...(parsedSubjectIds.length > 0 ? { subjectIds: parsedSubjectIds } : {}),
        ...(from ? { from } : {}),
        ...(until ? { until } : {}),
      })
    : { cancelledClasses: [] };

  return (
    <CancelledClassesPageClient
      cancelledClasses={cancelledClasses}
      initialSubjectIds={subjectIds ?? ""}
      initialFrom={from ?? ""}
      initialUntil={until ?? ""}
      hasSearched={hasSearched}
    />
  );
}
