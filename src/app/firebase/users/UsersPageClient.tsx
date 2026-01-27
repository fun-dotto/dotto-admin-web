"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "@/components/users/UserTable";
import { FirebaseUser } from "./actions";

interface UsersPageClientProps {
  users: FirebaseUser[];
}

export function UsersPageClient({ users }: UsersPageClientProps) {
  const { user, loading, signInWithGoogle, signOut, authError } = useAuth();

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
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                {users.length} 件
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                ユーザーが見つかりませんでした
              </div>
            ) : (
              <UserTable users={users} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
