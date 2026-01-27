"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { ChevronLeft, ChevronRight, ShieldPlus, ShieldMinus } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { UserTable } from "@/components/users/UserTable";
import { UserFilters } from "@/components/users/UserFilters";
import { FirebaseUser, updateAdminClaim } from "./actions";
import { PAGE_SIZE_OPTIONS, PageSize, StatusFilter } from "./constants";

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
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, signInWithGoogle, signOut, authError } = useAuth();

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

  // 検索モードではサーバーでフィルタリング済み、通常モードではusersをそのまま使用
  // （通常モードではフィルタがないためフィルタリング不要）
  const displayUsers = users;

  const buildUrl = (params: {
    pageToken?: string;
    history?: string[];
    pageSize?: number;
    q?: string;
    status?: StatusFilter;
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
      })
    );
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10) as PageSize;
    // ページサイズ変更時は1ページ目に戻る
    router.push(buildUrl({ pageSize: newPageSize, q: searchQuery, status: statusFilter }));
  };

  const handleSearchChange = (value: string) => {
    // 検索モードではページネーションパラメータを削除（全件検索）
    router.push(
      buildUrl({
        pageSize,
        q: value,
        status: statusFilter,
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
      })
    );
  };

  const handleClearFilters = () => {
    // フィルタクリア時は1ページ目に戻る
    router.push(
      buildUrl({
        pageSize,
      })
    );
  };

  // 選択中のユーザーからログインユーザー自身を除外したリスト
  const selectedUsersExcludingSelf = Array.from(selectedUserIds).filter(
    (uid) => uid !== user?.uid
  );

  // admin権限変更ダイアログを開く
  const handleOpenAdminDialog = (action: "grant" | "revoke") => {
    setAdminDialogAction(action);
    setAdminDialogOpen(true);
  };

  // admin権限変更を実行
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
            ? `${result.updatedCount}人のユーザーに管理者権限を付与しました`
            : `${result.updatedCount}人のユーザーから管理者権限を剥奪しました`
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

  // 剥奪対象にログインユーザー自身が含まれているかチェック
  const selfIncludedInRevoke =
    selectedUserIds.has(user?.uid || "") && selectedUserIds.size > 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <main className="flex flex-col items-center gap-8 p-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Dotto Admin
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            管理画面にアクセスするにはログインしてください
          </p>
          {authError && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {authError}
            </div>
          )}
          <Button onClick={signInWithGoogle} variant="outline" size="lg">
            Googleでログイン
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 dark:text-zinc-50"
          >
            Dotto Admin
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-zinc-600 dark:text-zinc-400">ユーザー管理</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user.photoURL && (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.displayName || user.email}
            </span>
          </div>
          <Button onClick={signOut} variant="ghost" size="sm">
            ログアウト
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6">
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAdminDialog("grant")}
                    disabled={isUpdating}
                  >
                    <ShieldPlus className="mr-1 size-4" />
                    管理者権限を付与
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenAdminDialog("revoke")}
                    disabled={isUpdating || selectedUsersExcludingSelf.length === 0}
                  >
                    <ShieldMinus className="mr-1 size-4" />
                    管理者権限を剥奪
                  </Button>
                </div>
                {selfIncludedInRevoke && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    ※自分自身の管理者権限は剥奪できません
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
      </main>

      <AlertDialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {adminDialogAction === "grant"
                ? "管理者権限を付与"
                : "管理者権限を剥奪"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {adminDialogAction === "grant" ? (
                <>
                  選択した{selectedUserIds.size}人のユーザーに管理者権限を付与します。
                  管理者はこの管理画面にアクセスできるようになります。
                </>
              ) : (
                <>
                  選択した{selectedUsersExcludingSelf.length}人のユーザーから管理者権限を剥奪します。
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
    </div>
  );
}
