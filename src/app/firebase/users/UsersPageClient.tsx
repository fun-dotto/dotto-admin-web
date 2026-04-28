"use client";

import { useState } from "react";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ChevronDown,
  ShieldPlus,
  ShieldMinus,
  CodeXml,
  UserCheck,
  UserX,
} from "lucide-react";
import { UserTable } from "@/components/users/UserTable";
import { UserFilters } from "@/components/users/UserFilters";
import {
  FirebaseUser,
  updateAdminClaim,
  updateDeveloperClaim,
  updateUserDisabledStatus,
} from "./actions";
import {
  StatusFilter,
  SortConfig,
  SortKey,
  SORT_KEYS,
} from "./constants";

interface UsersPageClientProps {
  users: FirebaseUser[];
  totalUserCount?: number;
}

export function UsersPageClient({
  users,
  totalUserCount,
}: UsersPageClientProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminDialogAction, setAdminDialogAction] = useState<
    "grant" | "revoke"
  >("grant");
  const [developerDialogOpen, setDeveloperDialogOpen] = useState(false);
  const [developerDialogAction, setDeveloperDialogAction] = useState<
    "grant" | "revoke"
  >("grant");
  const [disabledDialogOpen, setDisabledDialogOpen] = useState(false);
  const [disabledDialogAction, setDisabledDialogAction] = useState<
    "enable" | "disable"
  >("enable");
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAuth();

  const searchQuery = searchParams.get("q") || "";
  const statusFilter = (searchParams.get("status") as StatusFilter) || "all";
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  const sortKeyParam = searchParams.get("sortKey") as SortKey | null;
  const sortDirectionParam = searchParams.get("sortDir") as
    | "asc"
    | "desc"
    | null;
  const sortConfig: SortConfig =
    sortKeyParam &&
    SORT_KEYS.includes(sortKeyParam as SortKey) &&
    (sortDirectionParam === "asc" || sortDirectionParam === "desc")
      ? { key: sortKeyParam as SortKey, direction: sortDirectionParam }
      : { key: "email", direction: "asc" };

  const sortUsers = (usersToSort: FirebaseUser[]): FirebaseUser[] => {

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

  const displayUsers = sortUsers(users);

  const buildUrl = (params: {
    q?: string;
    status?: StatusFilter;
    sortKey?: SortKey;
    sortDir?: "asc" | "desc";
  }) => {
    const urlParams = new URLSearchParams();
    if (params.q) urlParams.set("q", params.q);
    if (params.status && params.status !== "all")
      urlParams.set("status", params.status);
    if (params.sortKey) urlParams.set("sortKey", params.sortKey);
    if (params.sortDir) urlParams.set("sortDir", params.sortDir);
    const query = urlParams.toString();
    return query ? `/firebase/users?${query}` : "/firebase/users";
  };

  const handleSearchChange = (value: string) => {
    router.push(
      buildUrl({
        q: value,
        status: statusFilter,
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      }),
    );
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    router.push(
      buildUrl({
        q: searchQuery,
        status: value,
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      }),
    );
  };

  const handleClearFilters = () => {
    router.push(
      buildUrl({
        sortKey: sortConfig?.key,
        sortDir: sortConfig?.direction,
      }),
    );
  };

  const handleSortChange = (key: SortKey) => {
    let newDirection: "asc" | "desc" = "asc";
    if (sortConfig?.key === key) {
      newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    router.push(
      buildUrl({
        q: searchQuery,
        status: statusFilter,
        sortKey: key,
        sortDir: newDirection,
      }),
    );
  };

  const selectedUsersExcludingSelf = Array.from(selectedUserIds).filter(
    (uid) => uid !== user?.uid,
  );

  const handleOpenAdminDialog = (action: "grant" | "revoke") => {
    setAdminDialogAction(action);
    setAdminDialogOpen(true);
  };

  const handleOpenDeveloperDialog = (action: "grant" | "revoke") => {
    setDeveloperDialogAction(action);
    setDeveloperDialogOpen(true);
  };

  const handleOpenDisabledDialog = (action: "enable" | "disable") => {
    setDisabledDialogAction(action);
    setDisabledDialogOpen(true);
  };

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
        adminDialogAction === "grant",
      );

      if (result.success) {
        toast.success(
          adminDialogAction === "grant"
            ? `${result.updatedCount}人のユーザーに管理者ロールを付与しました`
            : `${result.updatedCount}人のユーザーから管理者ロールを剥奪しました`,
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
        developerDialogAction === "grant",
      );

      if (result.success) {
        toast.success(
          developerDialogAction === "grant"
            ? `${result.updatedCount}人のユーザーに開発者ロールを付与しました`
            : `${result.updatedCount}人のユーザーから開発者ロールを剥奪しました`,
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
        disabledDialogAction === "disable",
      );

      if (result.success) {
        toast.success(
          disabledDialogAction === "enable"
            ? `${result.updatedCount}人のユーザーを有効化しました`
            : `${result.updatedCount}人のユーザーを無効化しました`,
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

  const selfIncludedInRevoke =
    selectedUserIds.has(user?.uid || "") && selectedUserIds.size > 0;

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
        <CardHeader>
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
                      <DropdownMenuItem
                        onClick={() => handleOpenAdminDialog("grant")}
                      >
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
                      <DropdownMenuItem
                        onClick={() => handleOpenDeveloperDialog("grant")}
                      >
                        <CodeXml className="mr-2 size-4" />
                        付与
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOpenDeveloperDialog("revoke")}
                      >
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
                    <DropdownMenuItem
                      onClick={() => handleOpenDisabledDialog("enable")}
                    >
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
          <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            {displayUsers.length}件表示中
            {totalUserCount !== undefined &&
              hasActiveFilters &&
              `（全${totalUserCount}件から検索）`}
          </div>
          {displayUsers.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              {hasActiveFilters
                ? "条件に一致するユーザーが見つかりませんでした"
                : "ユーザーが見つかりませんでした"}
            </div>
          ) : (
            <UserTable
              users={displayUsers}
              selectedUserIds={selectedUserIds}
              onSelectionChange={setSelectedUserIds}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
            />
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
                  選択した{selectedUserIds.size}
                  人のユーザーに管理者ロールを付与します。
                  管理者はこの管理画面にアクセスできるようになります。
                </>
              ) : (
                <>
                  選択した{selectedUsersExcludingSelf.length}
                  人のユーザーから管理者ロールを剥奪します。
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

      <AlertDialog
        open={developerDialogOpen}
        onOpenChange={setDeveloperDialogOpen}
      >
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
                  選択した{selectedUserIds.size}
                  人のユーザーに開発者ロールを付与します。
                </>
              ) : (
                <>
                  選択した{selectedUserIds.size}
                  人のユーザーから開発者ロールを剥奪します。
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

      <AlertDialog
        open={disabledDialogOpen}
        onOpenChange={setDisabledDialogOpen}
      >
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
                  選択した{selectedUsersExcludingSelf.length}
                  人のユーザーを無効化します。
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
