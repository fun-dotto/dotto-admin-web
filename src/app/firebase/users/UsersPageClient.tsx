"use client";

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
import { UserTable } from "@/components/users/UserTable";
import { FirebaseUser } from "./actions";
import { PAGE_SIZE_OPTIONS, PageSize } from "./constants";

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
  const pageHistory = historyParam ? historyParam.split(",") : [];
  const currentPage = pageHistory.length + 1;
  const hasPrevious = currentPage > 1;
  const hasNext = !!nextPageToken;

  const buildUrl = (params: {
    pageToken?: string;
    history?: string[];
    pageSize?: number;
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
      })
    );
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10) as PageSize;
    // ページサイズ変更時は1ページ目に戻る
    router.push(buildUrl({ pageSize: newPageSize }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">読み込み中...</div>
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
          <CardHeader>
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
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                ユーザーが見つかりませんでした
              </div>
            ) : (
              <>
                <UserTable users={users} />
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
