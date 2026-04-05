export const dynamic = "force-dynamic";

import { fetchReservations } from "./actions";
import { ReservationsPageClient } from "./ReservationsPageClient";

interface ReservationsPageProps {
  searchParams: Promise<{
    roomIds?: string;
    from?: string;
    until?: string;
    searched?: string;
  }>;
}

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
  const { roomIds, from, until, searched } = await searchParams;
  const hasSearched = searched === "1";
  const parsedRoomIds = (roomIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { reservations, error } = hasSearched
    ? await fetchReservations({
        ...(parsedRoomIds.length > 0 ? { roomIds: parsedRoomIds } : {}),
        ...(from ? { from } : {}),
        ...(until ? { until } : {}),
      })
    : { reservations: [], error: undefined };

  return (
    <ReservationsPageClient
      reservations={reservations}
      initialRoomIds={roomIds ?? ""}
      initialFrom={from ?? ""}
      initialUntil={until ?? ""}
      hasSearched={hasSearched}
      error={error}
    />
  );
}
