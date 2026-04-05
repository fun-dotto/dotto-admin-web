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
  const { faculties } = hasSearched
    ? await fetchFaculties(query)
    : { faculties: [] as never[] };

  return <FacultiesPageClient faculties={faculties} initialQuery={query} hasSearched={hasSearched} />;
}
