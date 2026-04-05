export const dynamic = "force-dynamic";

import { fetchFaculties } from "./actions";
import { FacultiesPageClient } from "./FacultiesPageClient";

interface FacultiesPageProps {
  searchParams: Promise<{
    q?: string;
    searched?: string;
  }>;
}

export default async function FacultiesPage({ searchParams }: FacultiesPageProps) {
  const { q, searched } = await searchParams;
  const query = q?.trim() ?? "";
  const hasSearched = searched === "1";
  const { faculties, error } = hasSearched
    ? await fetchFaculties(query)
    : { faculties: [] as never[], error: undefined };

  return <FacultiesPageClient faculties={faculties} initialQuery={query} hasSearched={hasSearched} error={error} />;
}
