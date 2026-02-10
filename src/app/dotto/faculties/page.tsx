export const dynamic = "force-dynamic";

import { fetchFaculties } from "./actions";
import { FacultiesPageClient } from "./FacultiesPageClient";

export default async function FacultiesPage() {
  const { faculties } = await fetchFaculties();

  return <FacultiesPageClient faculties={faculties} />;
}
