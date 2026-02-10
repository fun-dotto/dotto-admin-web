export const dynamic = "force-dynamic";

import { fetchDayOfWeekTimetableSlots } from "./actions";
import { DayOfWeekTimetableSlotsPageClient } from "./DayOfWeekTimetableSlotsPageClient";

export default async function DayOfWeekTimetableSlotsPage() {
  const { dayOfWeekTimetableSlots } = await fetchDayOfWeekTimetableSlots();

  return (
    <DayOfWeekTimetableSlotsPageClient
      dayOfWeekTimetableSlots={dayOfWeekTimetableSlots}
    />
  );
}
