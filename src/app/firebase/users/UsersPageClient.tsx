"use client";

import { useState } from "react";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight, ShieldPlus, ShieldMinus, CodeXml, UserCheck, UserX } from "lucide-react";
import { UserTable } from "@/components/users/UserTable";
import { UserFilters } from "@/components/users/UserFilters";
import { FirebaseUser, updateAdminClaim, updateDeveloperClaim, updateUserDisabledStatus } from "./actions";
import { PAGE_SIZE_OPTIONS, PageSize, StatusFilter, SortConfig, SortKey, SORT_KEYS } from "./constants";

interface UsersPageClientProps {
  users: FirebaseUser[];
  nextPageToken: string | undefined;
  currentPageToken: string | undefined;
  pageSize: PageSize;
  isSearchMode: boolean;
  totalUserCount?: number;
}

export function UsersPageClient({
  users,
  nextPageToken,
  currentPageToken,
  pageSize,
  isSearchMode,
  totalUserCount,
}: UsersPageClientProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminDialogAction, setAdminDialogAction] = useState<"grant" | "revoke">("grant");
  const [developerDialogOpen, setDeveloperDialogOpen] = useState(false);
  const [developerDialogAction, setDeveloperDialogAction] = useState<"grant" | "revoke">("grant");
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false);
  const [disabledDialogAction, setDisabledDialogAction] = useState<"enable" | "disable">("enable");
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();

  // ページ履歴をURLから取得（空文字列は1ページ目のマーカー）
  const historyParam = searchParams.get("history");
  const pageHistory = historyParam !== null ? historyParam.split(",") : [];
  const currentPage = pageHistory.length + 1;
  const hasPrevious = currentPage > 1;
  const hasNext = !!nextPageToken;

  // フィルタ状態をURLから取得
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = (searchParams.get("status") as StatusFilter) || "all";
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  // ソート状態をURLから取得
  const sortKeyParam = searchParams.get("sortKey") as SortKey | null;
  const sortDirectionParam = searchParams.get("sortDir") as "asc" | "desc" | null;
  const sortConfig: SortConfig | null =
    sortKeyParam && SORT_KEYS.includes(sortKeyParam as SortKey) && (sortDirectionParam === "asc" || sortDirectionParam === "desc")
      ? { key: sortKeyParam as SortKey, direction: sortDirectionParam }
      : null;

  // ソート関数
  const sortUsers = (usersToSort: FirebaseUser[]): FirebaseUser[] => {
    if (!sortConfig) return usersToSort;

    return [...usersToSort].sort((a, b) => {
      const { key, direction } = sortConfig;
      let aValue: string | undefined;
      let bValue: string | undefined;

      switch (key) {
        case "displayName":
          aValue = a.displayName?.toLowerCase() || "";
          bValue = b.displayName?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "uid":
          aValue = a.uid;
          bValue = b.uid;
          break;
        case "creationTime":
          aValue = a.creationTime || "";
          bValue = b.creationTime || "";
          break;
        case "lastSignInTime":
          aValue = a.lastSignInTime || "";
          bValue = b.lastSignInTime || "";
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // 検索モードではサーバーでフィルタリング済み、通常モードではusersをそのまま使用
  // （通常モードではフィルタがないためフィルタリング不要）
  const displayUsers = sortUsers(users);

  const buildUrl = (params: {
    pageToken?: string;
    history?: string[];
    pageSize?: number;
    q?: string;
    status?: StatusFilter;
    sortKey?: SortKey;
    sortDir?: "asc" | "desc";
  }) => {
    const urlParams = new URLSearchParams();
    if (params.pageToken) {
      urlParams.set("pageToken", params.pageToken);
    }
    if (params.history && params.history.length > 0) {
      urlParams.set("history", params.history.join(","));
    }
    if (params.pageSize) {
      urlParams.set("pageSize", params.pageSize.toString());
    }
    if (params.q) {
      urlParams.set("q", params.q);
    }
    if (params.status && params.status !== "all") {
      urlParams.set("status", params.status);
    }
    if (params.sortKey) {
      urlParams.set("sortKey", params.sortKey);
    }
    if (params.sortDir) {
      urlParams.set("sortDir", params.sortDir);
    }
    const query = urlParams.toString();
    return query ? `/firebase/users?${query}` : "/firebase/users";
  };

  const handlePrevious = () => {
    if (!hasPrevious) return;
    const newHistory = [...pageHistory];
    const prevToken = newHistory.pop();
    router.push(
      buildUrl({
        // 空文字列は1ページ目を示すマーカーなのでundefinedに変換
        pageToken: prevToken || undefined,
        history: newHistory,
        pageSize,
        q: searchQuery,
        status: statusFilter,
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      })
    );
  };

  const handleNext = () => {
    if (!hasNext || !nextPageToken) return;
    // 1ページ目は空文字列をマーカーとして履歴に追加
    const newHistory = [...pageHistory, currentPageToken || ""];
    router.push(
      buildUrl({
        pageToken: nextPageToken,
        history: newHistory,
        pageSize,
        q: searchQuery,
        status: statusFilter,
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      })
    );
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10) as PageSize;
    // ページサイズ変更時は1ページ目に戻る
    router.push(buildUrl({ pageSize: newPageSize, q: searchQuery, status: statusFilter, sortKey: sortConfig?.key, sortDir: sortConfig?.direction }));
  };

  const handleSearchChange = (value: string) => {
    // 検索モードではページネーションパラメータを削除（全件検索）
    router.push(
      buildUrl({
        pageSize,
        q: value,
        status: statusFilter,
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      })
    );
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    // 検索モードではページネーションパラメータを削除（全件検索）
    router.push(
      buildUrl({
        pageSize,
        q: searchQuery,
        status: value,
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      })
    );
  };

  const handleClearFilters = () => {
    // フィルタクリア時は1ページ目に戻る
    router.push(
      buildUrl({
        pageSize,
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      })
    );
  };

  const handleSortChange = (key: SortKey) => {
    let newDirection: "asc" | "desc" = "asc";
    if (sortConfig?.key === key) {
      // 同じカラムをクリックした場合は方向を切り替え
      newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    router.push(
      buildUrl({
        pageToken: currentPageToken,
        history: pageHistory,
        pageSize,
        q: searchQuery,
        status: statusFilter,
        sortKey: key,
        sortDir: newDirection,
      })
    );
  };

  // 選択中のユーザーからログインユーザー自身を除外したリスト
  const selectedUsersExcludingSelf = Array.from(selectedUserIds).filter(
    (uid) => uid !== user?.uid
  );

  // adminロール変更ダイアログを開く
  const handleOpenAdminDialog = (action: "grant" | "revoke") => {
    setAdminDialogAction(action);
    setAdminDialogOpen(true);
  };

  // developerロール変更ダイアログを開く
  const handleOpenDeveloperDialog = (action: "grant" | "revoke") => {
    setDeveloperDialogAction(action);
    setDeveloperDialogOpen(true);
  };

  // 有効/無効切り替えダイアログを開く
  const handleOpenDisabledDialog = (action: "enable" | "disable") => {
    setDisabledDialogAction(action);
    setDisabledDialogOpen(true);
  };

  // adminロール変更を実行
  const handleConfirmAdminChange = async () => {
    const targetIds =
      adminDialogAction === "revoke"
        ? selectedUsersExcludingSelf
        : Array.from(selectedUserIds);

    if (targetIds.length === 0) {
      toast.error("対象ユーザーがいません");
      setAdminDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateAdminClaim(
        targetIds,
        adminDialogAction === "grant"
      );

      if (result.success) {
        toast.success(
          adminDialogAction === "grant"
            ? `${result.updatedCount}人のユーザーに管理者ロールを付与しました`
            : `${result.updatedCount}人のユーザーから管理者ロールを剥奪しました`
        );
        setSelectedUserIds(new Set());
        router.refresh();
      } else {
        toast.error(`一部のユーザーの更新に失敗しました`, {
          description: result.errors.join("\n"),
        });
        if (result.updatedCount > 0) {
          router.refresh();
        }
      }
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsUpdating(false);
      setAdminDialogOpen(false);
    }
  };

  // developerロール変更を実行
  const handleConfirmDeveloperChange = async () => {
    const targetIds = Array.from(selectedUserIds);

    if (targetIds.length === 0) {
      toast.error("対象ユーザーがいません");
      setDeveloperDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateDeveloperClaim(
        targetIds,
        developerDialogAction === "grant"
      );

      if (result.success) {
        toast.success(
          developerDialogAction === "grant"
            ? `${result.updatedCount}人のユーザーに開発者ロールを付与しました`
            : `${result.updatedCount}人のユーザーから開発者ロールを剥奪しました`
        );
        setSelectedUserIds(new Set());
        router.refresh();
      } else {
        toast.error(`一部のユーザーの更新に失敗しました`, {
          description: result.errors.join("\n"),
        });
        if (result.updatedCount > 0) {
          router.refresh();
        }
      }
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsUpdating(false);
      setDeveloperDialogOpen(false);
    }
  };

  // 有効/無効切り替えを実行
  const handleConfirmDisabledChange = async () => {
    const targetIds =
      disabledDialogAction === "disable"
        ? selectedUsersExcludingSelf
        : Array.from(selectedUserIds);

    if (targetIds.length === 0) {
      toast.error("対象ユーザーがいません");
      setDisabledDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateUserDisabledStatus(
        targetIds,
        disabledDialogAction === "disable"
      );

      if (result.success) {
        toast.success(
          disabledDialogAction === "enable"
            ? `${result.updatedCount}人のユーザーを有効化しました`
            : `${result.updatedCount}人のユーザーを無効化しました`
        );
        setSelectedUserIds(new Set());
        router.refresh();
      } else {
        toast.error(`一部のユーザーの更新に失敗しました`, {
          description: result.errors.join("\n"),
        });
        if (result.updatedCount > 0) {
          router.refresh();
        }
      }
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsUpdating(false);
      setDisabledDialogOpen(false);
    }
  };

  // 剥奪対象にログインユーザー自身が含まれているかチェック
  const selfIncludedInRevoke =
    selectedUserIds.has(user?.uid || "") && selectedUserIds.size > 0;

  // 管理者権限がない場合はアクセス拒否
  if (!isAdmin) {
    return (
      <AuthenticatedLayout>
        <Card>
          <CardHeader>
            <CardTitle>アクセス権限がありません</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600 dark:text-zinc-400">
              このページは管理者のみアクセスできます。
            </p>
          </CardContent>
        </Card>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
        <Card>
          <CardHeader className="space-y-4">
            <CardTitle className="flex items-center justify-between">
              <span>ユーザー一覧</span>
              {!isSearchMode && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                      表示件数
                    </span>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={handlePageSizeChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}件
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handlePrevious}
                      disabled={!hasPrevious}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="min-w-16 text-center text-sm font-normal text-zinc-500 dark:text-zinc-400">
                      ページ {currentPage}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleNext}
                      disabled={!hasNext}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardTitle>
            <UserFilters
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              onSearchChange={handleSearchChange}
              onStatusFilterChange={handleStatusFilterChange}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </CardHeader>
          <CardContent>
            {selectedUserIds.size > 0 && (
              <div className="mb-4 flex items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
                <span className="text-sm text-zinc-600 dark:text-zinc-300">
                  {selectedUserIds.size}件選択中
                </span>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isUpdating}>
                        ロール管理
                        <ChevronDown className="ml-1 size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>管理者ロール</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleOpenAdminDialog("grant")}>
                          <ShieldPlus className="mr-2 size-4" />
                          付与
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOpenAdminDialog("revoke")}
                          disabled={selectedUsersExcludingSelf.length === 0}
                        >
                          <ShieldMinus className="mr-2 size-4" />
                          剥奪
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>開発者ロール</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => handleOpenDeveloperDialog("grant")}>
                          <CodeXml className="mr-2 size-4" />
                          付与
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDeveloperDialog("revoke")}>
                          <CodeXml className="mr-2 size-4" />
                          剥奪
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isUpdating}>
                        ステータス
                        <ChevronDown className="ml-1 size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleOpenDisabledDialog("enable")}>
                        <UserCheck className="mr-2 size-4" />
                        有効化
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenDisabledDialog("disable")}
                        disabled={selectedUsersExcludingSelf.length === 0}
                      >
                        <UserX className="mr-2 size-4" />
                        無効化
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {selfIncludedInRevoke && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    ※自分自身の管理者ロールは剥奪できません
                  </span>
                )}
              </div>
            )}
            {hasActiveFilters && (
              <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                {displayUsers.length}件表示中
                {totalUserCount !== undefined && `（全${totalUserCount}件から検索）`}
              </div>
            )}
            {displayUsers.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                {hasActiveFilters
                  ? "条件に一致するユーザーが見つかりませんでした"
                  : "ユーザーが見つかりませんでした"}
              </div>
            ) : (
              <>
                <UserTable
                  users={displayUsers}
                  selectedUserIds={selectedUserIds}
                  onSelectionChange={setSelectedUserIds}
                  sortConfig={sortConfig}
                  onSortChange={handleSortChange}
                />
                {!isSearchMode && (
                  <div className="mt-4 flex justify-center">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={!hasPrevious}
                      >
                        <ChevronLeft className="size-4" />
                        前へ
                      </Button>
                      <span className="min-w-20 text-center text-sm text-zinc-600 dark:text-zinc-400">
                        ページ {currentPage}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNext}
                        disabled={!hasNext}
                      >
                        次へ
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

      <AlertDialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {adminDialogAction === "grant"
                ? "管理者ロールを付与"
                : "管理者ロールを剥奪"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminDialogAction === "grant" ? (
                <>
                  選択した{selectedUserIds.size}人のユーザーに管理者ロールを付与します。
                  管理者はこの管理画面にアクセスできるようになります。
                </>
              ) : (
                <>
                  選択した{selectedUsersExcludingSelf.length}人のユーザーから管理者ロールを剥奪します。
                  {selfIncludedInRevoke && (
                    <span className="mt-2 block text-amber-600 dark:text-amber-400">
                      ※自分自身は対象から除外されます
                    </span>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAdminChange}
              disabled={isUpdating}
            >
              {isUpdating ? "処理中..." : "確認"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={developerDialogOpen} onOpenChange={setDeveloperDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {developerDialogAction === "grant"
                ? "開発者ロールを付与"
                : "開発者ロールを剥奪"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {developerDialogAction === "grant" ? (
                <>
                  選択した{selectedUserIds.size}人のユーザーに開発者ロールを付与します。
                </>
              ) : (
                <>
                  選択した{selectedUserIds.size}人のユーザーから開発者ロールを剥奪します。
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeveloperChange}
              disabled={isUpdating}
            >
              {isUpdating ? "処理中..." : "確認"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={disabledDialogOpen} onOpenChange={setDisabledDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {disabledDialogAction === "enable"
                ? "ユーザーを有効化"
                : "ユーザーを無効化"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {disabledDialogAction === "enable" ? (
                <>
                  選択した{selectedUserIds.size}人のユーザーを有効化します。
                  有効化されたユーザーはログインできるようになります。
                </>
              ) : (
                <>
                  選択した{selectedUsersExcludingSelf.length}人のユーザーを無効化します。
                  無効化されたユーザーはログインできなくなります。
                  {selfIncludedInRevoke && (
                    <span className="mt-2 block text-amber-600 dark:text-amber-400">
                      ※自分自身は対象から除外されます
                    </span>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDisabledChange}
              disabled={isUpdating}
            >
              {isUpdating ? "処理中..." : "確認"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthenticatedLayout>
  );
}
