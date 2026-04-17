export const dynamic = "force-dynamic";

import { fetchFaculties } from "@/app/dotto/faculties/actions";
import { fetchRooms } from "@/app/dotto/facility-rooms/actions";
import { NewFacultyRoomPageClient } from "./NewFacultyRoomPageClient";

export default async function NewFacultyRoomPage() {
  const [facultiesResult, roomsResult] = await Promise.all([
    fetchFaculties(),
    fetchRooms(),
  ]);

  const error = facultiesResult.error ?? roomsResult.error;

  return (
    <NewFacultyRoomPageClient
      faculties={facultiesResult.faculties}
      rooms={roomsResult.rooms}
      error={error}
    />
  );
}
