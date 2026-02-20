import { notFound } from "next/navigation";
import { fetchCourse } from "../../actions";
import { EditCoursePageClient } from "./EditCoursePageClient";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({
  params,
}: EditCoursePageProps) {
  const { id } = await params;
  const { course } = await fetchCourse(id);

  if (!course) {
    notFound();
  }

  return <EditCoursePageClient course={course} />;
}
