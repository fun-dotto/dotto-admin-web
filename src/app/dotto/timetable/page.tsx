export const dynamic = "force-dynamic";

import { fetchTimetableItems } from "./actions";
import { fetchSubjects } from "@/app/dotto/subjects/actions";
import { fetchRooms } from "@/app/dotto/facility-rooms/actions";
import { TimetablePageClient } from "./TimetablePageClient";
import { DAY_OF_WEEK_VALUES } from "./constants";

export default async function TimetablePage() {
  const [timetableResult, subjectsResult, roomsResult] = await Promise.all([
    fetchTimetableItems("Q1", DAY_OF_WEEK_VALUES),
    fetchSubjects(),
    fetchRooms(),
  ]);

  return (
    <TimetablePageClient
      initialItems={timetableResult.items}
      subjects={subjectsResult.subjects}
      rooms={roomsResult.rooms}
    />
  );
}
