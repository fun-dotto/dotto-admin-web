import { notFound } from "next/navigation";
import { fetchFaculty } from "../../actions";
import { EditFacultyPageClient } from "./EditFacultyPageClient";

interface EditFacultyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFacultyPage({
  params,
}: EditFacultyPageProps) {
  const { id } = await params;
  const { faculty } = await fetchFaculty(id);

  if (!faculty) {
    notFound();
  }

  return <EditFacultyPageClient faculty={faculty} />;
}
