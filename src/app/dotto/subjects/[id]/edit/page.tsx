import { notFound } from "next/navigation";
import { fetchSubject } from "../../actions";
import { EditSubjectPageClient } from "./EditSubjectPageClient";

interface EditSubjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSubjectPage({
  params,
}: EditSubjectPageProps) {
  const { id } = await params;
  const { subject } = await fetchSubject(id);

  if (!subject) {
    notFound();
  }

  return <EditSubjectPageClient subject={subject} />;
}
