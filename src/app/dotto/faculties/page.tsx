export const dynamic = "force-dynamic";

import { fetchFaculties } from "./actions";
import { FacultiesPageClient } from "./FacultiesPageClient";

interface FacultiesPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function FacultiesPage({ searchParams }: FacultiesPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { faculties } = await fetchFaculties(query);

  return <FacultiesPageClient faculties={faculties} initialQuery={query} />;
}
