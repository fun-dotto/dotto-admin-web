export const dynamic = "force-dynamic";

import { searchUsers } from "./actions";
import { STATUS_FILTER_OPTIONS, StatusFilter } from "./constants";
import { UsersPageClient } from "./UsersPageClient";

interface UsersPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { q, status } = await searchParams;

  const validStatuses = STATUS_FILTER_OPTIONS.map((o) => o.value);
  const statusFilter: StatusFilter = validStatuses.includes(
    status as StatusFilter,
  )
    ? (status as StatusFilter)
    : "all";

  const searchQuery = q || "";
  const result = await searchUsers(searchQuery, statusFilter);

  return (
    <UsersPageClient
      users={result.users}
      totalUserCount={result.totalCount}
    />
  );
}
