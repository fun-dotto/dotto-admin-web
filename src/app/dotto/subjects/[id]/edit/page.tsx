import { notFound } from "next/navigation";
import { fetchSubject, fetchRelatedResources } from "../../actions";
import { EditSubjectPageClient } from "./EditSubjectPageClient";

interface EditSubjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSubjectPage({
  params,
}: EditSubjectPageProps) {
  const { id } = await params;
  const [{ subject }, relatedResources] = await Promise.all([
    fetchSubject(id),
    fetchRelatedResources(),
  ]);

  if (!subject) {
    notFound();
  }

  return (
    <EditSubjectPageClient
      subject={subject}
      courses={relatedResources.courses}
      faculties={relatedResources.faculties}
      subjectCategories={relatedResources.subjectCategories}
      dayOfWeekTimetableSlots={relatedResources.dayOfWeekTimetableSlots}
    />
  );
}
