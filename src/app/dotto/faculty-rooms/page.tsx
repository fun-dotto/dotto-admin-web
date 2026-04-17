export const dynamic = "force-dynamic";

import { DEFAULT_ACADEMIC_YEAR, isAcademicYear } from "@/lib/academic-year";
import { fetchFacultyRooms } from "./actions";
import { FacultyRoomsPageClient } from "./FacultyRoomsPageClient";

interface FacultyRoomsPageProps {
  searchParams: Promise<{
    year?: string;
  }>;
}

export default async function FacultyRoomsPage({
  searchParams,
}: FacultyRoomsPageProps) {
  const { year } = await searchParams;
  const parsedYear = year ? Number(year) : NaN;
  const validYear = isAcademicYear(parsedYear)
    ? parsedYear
    : DEFAULT_ACADEMIC_YEAR;
  const { facultyRooms, error } = await fetchFacultyRooms(validYear);

  return (
    <FacultyRoomsPageClient
      facultyRooms={facultyRooms}
      initialYear={validYear}
      error={error}
    />
  );
}
