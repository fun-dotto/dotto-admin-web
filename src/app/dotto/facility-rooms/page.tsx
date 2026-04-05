export const dynamic = "force-dynamic";

import { fetchRooms } from "./actions";
import { FacilityRoomsPageClient } from "./FacilityRoomsPageClient";
import { FLOOR_VALUES, type Floor } from "./constants";

interface FacilityRoomsPageProps {
  searchParams: Promise<{
    q?: string;
    floor?: string;
    searched?: string;
  }>;
}

export default async function FacilityRoomsPage({
  searchParams,
}: FacilityRoomsPageProps) {
  const { q, floor, searched } = await searchParams;
  const query = q?.trim() ?? "";
  const validatedFloor: Floor | undefined = FLOOR_VALUES.includes(floor as Floor)
    ? (floor as Floor)
    : undefined;
  const hasSearched = searched === "1";
  const { rooms, error } = hasSearched
    ? await fetchRooms({ q: query, floor: validatedFloor })
    : { rooms: [] as never[], error: undefined };

  return (
    <FacilityRoomsPageClient
      rooms={rooms}
      initialQuery={query}
      initialFloor={validatedFloor}
      hasSearched={hasSearched}
      error={error}
    />
  );
}
