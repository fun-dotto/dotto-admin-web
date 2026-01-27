"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FirebaseUser } from "@/app/firebase/users/actions";

interface UserTableProps {
  users: FirebaseUser[];
}

export function UserTable({ users }: UserTableProps) {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead>ユーザー</TableHead>
          <TableHead>UID</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead>作成日時</TableHead>
          <TableHead>最終ログイン</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.uid}>
            <TableCell>
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                  {user.displayName?.[0] || user.email?.[0] || "?"}
                </div>
              )}
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {user.displayName || "-"}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.email || "-"}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <code className="text-xs text-zinc-600 dark:text-zinc-400">
                {user.uid}
              </code>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.isAdmin && (
                  <Badge variant="default">管理者</Badge>
                )}
                {user.disabled ? (
                  <Badge variant="destructive">無効</Badge>
                ) : (
                  <Badge variant="secondary">有効</Badge>
                )}
                {user.emailVerified && (
                  <Badge variant="outline">メール認証済</Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {formatDate(user.creationTime)}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {formatDate(user.lastSignInTime)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
