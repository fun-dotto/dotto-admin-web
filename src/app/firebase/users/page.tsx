import { fetchUsers } from "./actions";
import { UsersPageClient } from "./UsersPageClient";

interface UsersPageProps {
  searchParams: Promise<{ pageToken?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { pageToken } = await searchParams;
  const result = await fetchUsers(pageToken);
  return (
    <UsersPageClient
      users={result.users}
      nextPageToken={result.nextPageToken}
      currentPageToken={pageToken}
    />
  );
}
