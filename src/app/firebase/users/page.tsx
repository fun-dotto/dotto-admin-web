import { fetchUsers, searchUsers, StatusFilter } from "./actions";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, PageSize, STATUS_FILTER_OPTIONS } from "./constants";
import { UsersPageClient } from "./UsersPageClient";

interface UsersPageProps {
  searchParams: Promise<{
    pageToken?: string;
    pageSize?: string;
    q?: string;
    status?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { pageToken, pageSize: pageSizeParam, q, status } = await searchParams;

  // ページサイズのバリデーション
  const parsedSize = pageSizeParam ? parseInt(pageSizeParam, 10) : DEFAULT_PAGE_SIZE;
  const pageSize: PageSize = PAGE_SIZE_OPTIONS.includes(parsedSize as PageSize)
    ? (parsedSize as PageSize)
    : DEFAULT_PAGE_SIZE;

  // ステータスフィルタのバリデーション
  const validStatuses = STATUS_FILTER_OPTIONS.map((o) => o.value);
  const statusFilter: StatusFilter = validStatuses.includes(status as StatusFilter)
    ? (status as StatusFilter)
    : "all";

  const searchQuery = q || "";
  const isSearchMode = searchQuery !== "" || statusFilter !== "all";

  if (isSearchMode) {
    // 検索モード: 全ユーザーから検索
    const result = await searchUsers(searchQuery, statusFilter);
    return (
      <UsersPageClient
        users={result.users}
        nextPageToken={undefined}
        currentPageToken={undefined}
        pageSize={pageSize}
        isSearchMode={true}
        totalUserCount={result.totalCount}
      />
    );
  }

  // 通常モード: ページネーション
  const result = await fetchUsers(pageSize, pageToken);

  return (
    <UsersPageClient
      users={result.users}
      nextPageToken={result.nextPageToken}
      currentPageToken={pageToken}
      pageSize={pageSize}
      isSearchMode={false}
    />
  );
}
