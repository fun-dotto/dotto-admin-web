"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { UserTable } from "@/components/users/UserTable";
import { UserFilters } from "@/components/users/UserFilters";
import { FirebaseUser } from "./actions";
import { PAGE_SIZE_OPTIONS, PageSize, StatusFilter } from "./constants";

interface UsersPageClientProps {
  users: FirebaseUser[];
  nextPageToken: string | undefined;
  currentPageToken: string | undefined;
  pageSize: PageSize;
}

export function UsersPageClient({
  users,
  nextPageToken,
  currentPageToken,
  pageSize,
}: UsersPageClientProps) {
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

  // クライアントサイドでフィルタリング
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // テキスト検索
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = user.displayName?.toLowerCase().includes(query);
        const matchesEmail = user.email?.toLowerCase().includes(query);
        const matchesUid = user.uid.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesUid) {
          return false;
        }
      }

      // ステータスフィルタ
      switch (statusFilter) {
        case "admin":
          return user.isAdmin;
        case "enabled":
          return !user.disabled;
        case "disabled":
          return user.disabled;
        case "verified":
          return user.emailVerified;
        case "unverified":
          return !user.emailVerified;
        default:
          return true;
      }
    });
  }, [users, searchQuery, statusFilter]);

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
    // 検索クエリ変更時は現在のページを維持
    router.push(
      buildUrl({
        pageToken: currentPageToken,
        history: pageHistory,
        pageSize,
        q: value,
        status: statusFilter,
      })
    );
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    // ステータスフィルタ変更時は現在のページを維持
    router.push(
      buildUrl({
        pageToken: currentPageToken,
        history: pageHistory,
        pageSize,
        q: searchQuery,
        status: value,
      })
    );
  };

  const handleClearFilters = () => {
    router.push(
      buildUrl({
        pageToken: currentPageToken,
        history: pageHistory,
        pageSize,
      })
    );
  };

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
            {hasActiveFilters && (
              <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                {filteredUsers.length}件表示中（このページ {users.length}件中）
              </div>
            )}
            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                {hasActiveFilters
                  ? "条件に一致するユーザーが見つかりませんでした"
                  : "ユーザーが見つかりませんでした"}
              </div>
            ) : (
              <>
                <UserTable users={filteredUsers} />
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
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
