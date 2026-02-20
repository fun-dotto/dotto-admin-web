import { notFound } from "next/navigation";
import { fetchDayOfWeekTimetableSlot } from "../../actions";
import { EditDayOfWeekTimetableSlotPageClient } from "./EditDayOfWeekTimetableSlotPageClient";

interface EditDayOfWeekTimetableSlotPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDayOfWeekTimetableSlotPage({
  params,
}: EditDayOfWeekTimetableSlotPageProps) {
  const { id } = await params;
  const { dayOfWeekTimetableSlot } = await fetchDayOfWeekTimetableSlot(id);

  if (!dayOfWeekTimetableSlot) {
    notFound();
  }

  return (
    <EditDayOfWeekTimetableSlotPageClient
      dayOfWeekTimetableSlot={dayOfWeekTimetableSlot}
    />
  );
}
