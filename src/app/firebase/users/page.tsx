import { fetchUsers } from "./actions";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, PageSize } from "./constants";
import { UsersPageClient } from "./UsersPageClient";

interface UsersPageProps {
  searchParams: Promise<{ pageToken?: string; pageSize?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { pageToken, pageSize: pageSizeParam } = await searchParams;

  // ページサイズのバリデーション
  const parsedSize = pageSizeParam ? parseInt(pageSizeParam, 10) : DEFAULT_PAGE_SIZE;
  const pageSize: PageSize = PAGE_SIZE_OPTIONS.includes(parsedSize as PageSize)
    ? (parsedSize as PageSize)
    : DEFAULT_PAGE_SIZE;

  const result = await fetchUsers(pageSize, pageToken);

  return (
    <UsersPageClient
      users={result.users}
      nextPageToken={result.nextPageToken}
      currentPageToken={pageToken}
      pageSize={pageSize}
    />
  );
}
