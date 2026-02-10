import { fetchRelatedResources } from "../actions";
import { NewSubjectPageClient } from "./NewSubjectPageClient";

export default async function NewSubjectPage() {
  const { courses, faculties, subjectCategories, dayOfWeekTimetableSlots } =
    await fetchRelatedResources();

  return (
    <NewSubjectPageClient
      courses={courses}
      faculties={faculties}
      subjectCategories={subjectCategories}
      dayOfWeekTimetableSlots={dayOfWeekTimetableSlots}
    />
  );
}
