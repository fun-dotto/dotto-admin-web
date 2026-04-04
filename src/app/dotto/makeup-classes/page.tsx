export const dynamic = "force-dynamic";

import { fetchMakeupClasses } from "./actions";
import { MakeupClassesPageClient } from "./MakeupClassesPageClient";

interface MakeupClassesPageProps {
  searchParams: Promise<{
    subjectIds?: string;
    from?: string;
    until?: string;
  }>;
}

export default async function MakeupClassesPage({
  searchParams,
}: MakeupClassesPageProps) {
  const { subjectIds, from, until } = await searchParams;
  const parsedSubjectIds = (subjectIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { makeupClasses } = await fetchMakeupClasses({
    ...(parsedSubjectIds.length > 0 ? { subjectIds: parsedSubjectIds } : {}),
    ...(from ? { from } : {}),
    ...(until ? { until } : {}),
  });

  return (
    <MakeupClassesPageClient
      makeupClasses={makeupClasses}
      initialSubjectIds={subjectIds ?? ""}
      initialFrom={from ?? ""}
      initialUntil={until ?? ""}
    />
  );
}
