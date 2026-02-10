export const dynamic = "force-dynamic";

import { fetchSubjectCategories } from "./actions";
import { SubjectCategoriesPageClient } from "./SubjectCategoriesPageClient";

export default async function SubjectCategoriesPage() {
  const { subjectCategories } = await fetchSubjectCategories();

  return <SubjectCategoriesPageClient subjectCategories={subjectCategories} />;
}
