export const dynamic = "force-dynamic";

import { fetchRooms } from "./actions";
import { FacilityRoomsPageClient } from "./FacilityRoomsPageClient";
import { FLOOR_VALUES, type Floor } from "./constants";

interface FacilityRoomsPageProps {
  searchParams: Promise<{
    q?: string;
    floor?: string;
  }>;
}

export default async function FacilityRoomsPage({
  searchParams,
}: FacilityRoomsPageProps) {
  const { q, floor } = await searchParams;
  const query = q?.trim() ?? "";
  const validatedFloor: Floor | undefined = FLOOR_VALUES.includes(floor as Floor)
    ? (floor as Floor)
    : undefined;
  const { rooms, error } = await fetchRooms({ q: query, floor: validatedFloor });

  return (
    <FacilityRoomsPageClient
      rooms={rooms}
      initialQuery={query}
      initialFloor={validatedFloor}
      error={error}
    />
  );
}
