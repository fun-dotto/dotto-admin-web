export const dynamic = "force-dynamic";

import { fetchReservations } from "./actions";
import { ReservationsPageClient } from "./ReservationsPageClient";

interface ReservationsPageProps {
  searchParams: Promise<{
    roomIds?: string;
    from?: string;
    until?: string;
  }>;
}

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
  const { roomIds, from, until } = await searchParams;
  const parsedRoomIds = (roomIds ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const { reservations } = await fetchReservations({
    ...(parsedRoomIds.length > 0 ? { roomIds: parsedRoomIds } : {}),
    ...(from ? { from } : {}),
    ...(until ? { until } : {}),
  });

  return (
    <ReservationsPageClient
      reservations={reservations}
      initialRoomIds={roomIds ?? ""}
      initialFrom={from ?? ""}
      initialUntil={until ?? ""}
    />
  );
}
