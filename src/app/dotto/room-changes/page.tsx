export const dynamic = "force-dynamic";

import { fetchRoomChanges } from "./actions";
import { RoomChangesPageClient } from "./RoomChangesPageClient";

interface RoomChangesPageProps {
  searchParams: Promise<{
    subjectIds?: string;
    from?: string;
    until?: string;
  }>;
}

export default async function RoomChangesPage({ searchParams }: RoomChangesPageProps) {
  const { subjectIds, from, until } = await searchParams;
  const hasSearchParams = subjectIds || from || until;
  const parsedSubjectIds = (subjectIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { roomChanges } = hasSearchParams
    ? await fetchRoomChanges({
        ...(parsedSubjectIds.length > 0 ? { subjectIds: parsedSubjectIds } : {}),
        ...(from ? { from } : {}),
        ...(until ? { until } : {}),
      })
    : { roomChanges: [] };

  return (
    <RoomChangesPageClient
      roomChanges={roomChanges}
      initialSubjectIds={subjectIds ?? ""}
      initialFrom={from ?? ""}
      initialUntil={until ?? ""}
      hasSearched={!!hasSearchParams}
    />
  );
}
