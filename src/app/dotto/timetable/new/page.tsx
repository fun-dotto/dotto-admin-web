export const dynamic = "force-dynamic";

import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { fetchRooms } from "@/app/dotto/facility-rooms/actions";
import { NewTimetableItemPageClient } from "./NewTimetableItemPageClient";

export default async function NewTimetableItemPage() {
  const [subjectsResult, roomsResult] = await Promise.all([
    fetchSubjects(),
    fetchRooms(),
  ]);

  return (
    <NewTimetableItemPageClient
      subjects={subjectsResult.subjects}
      rooms={roomsResult.rooms}
    />
  );
}
