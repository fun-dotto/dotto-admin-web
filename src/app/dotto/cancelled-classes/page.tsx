export const dynamic = "force-dynamic";

import { fetchCancelledClasses } from "./actions";
import { CancelledClassesPageClient } from "./CancelledClassesPageClient";

interface CancelledClassesPageProps {
  searchParams: Promise<{
    subjectIds?: string;
    from?: string;
    until?: string;
  }>;
}

export default async function CancelledClassesPage({
  searchParams,
}: CancelledClassesPageProps) {
  const { subjectIds, from, until } = await searchParams;
  const hasSearchParams = subjectIds || from || until;
  const parsedSubjectIds = (subjectIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { cancelledClasses } = hasSearchParams
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
      hasSearched={!!hasSearchParams}
    />
  );
}
