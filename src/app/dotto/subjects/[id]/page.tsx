import { notFound } from "next/navigation";
import { fetchSubject } from "../actions";
import { SubjectDetailPageClient } from "./SubjectDetailPageClient";

interface SubjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubjectDetailPage({
  params,
}: SubjectDetailPageProps) {
  const { id } = await params;
  const { subject } = await fetchSubject(id);

  if (!subject) {
    notFound();
  }

  return <SubjectDetailPageClient subject={subject} />;
}
