export const dynamic = "force-dynamic";

import { fetchRoomChanges } from "./actions";
import { RoomChangesPageClient } from "./RoomChangesPageClient";

interface RoomChangesPageProps {
  searchParams: Promise<{
    subjectIds?: string;
    from?: string;
    until?: string;
    searched?: string;
  }>;
}

export default async function RoomChangesPage({ searchParams }: RoomChangesPageProps) {
  const { subjectIds, from, until, searched } = await searchParams;
  const hasSearched = searched === "1";
  const parsedSubjectIds = (subjectIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { roomChanges } = hasSearched
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
      hasSearched={hasSearched}
    />
  );
}
