import { notFound } from "next/navigation";
import { fetchSubjectCategory } from "../../actions";
import { EditSubjectCategoryPageClient } from "./EditSubjectCategoryPageClient";

interface EditSubjectCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSubjectCategoryPage({
  params,
}: EditSubjectCategoryPageProps) {
  const { id } = await params;
  const { subjectCategory } = await fetchSubjectCategory(id);

  if (!subjectCategory) {
    notFound();
  }

  return <EditSubjectCategoryPageClient subjectCategory={subjectCategory} />;
}
