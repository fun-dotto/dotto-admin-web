export const dynamic = "force-dynamic";

import { fetchRooms } from "./actions";
import { FacilityRoomsPageClient } from "./FacilityRoomsPageClient";

export default async function FacilityRoomsPage() {
  const { rooms } = await fetchRooms();

  return <FacilityRoomsPageClient rooms={rooms} />;
}
