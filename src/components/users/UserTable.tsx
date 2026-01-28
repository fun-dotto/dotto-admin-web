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
import { Checkbox } from "@/components/ui/checkbox";
import { FirebaseUser } from "@/app/firebase/users/actions";

interface UserTableProps {
  users: FirebaseUser[];
  selectedUserIds: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

export function UserTable({
  users,
  selectedUserIds,
  onSelectionChange,
}: UserTableProps) {
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

  const allSelected =
    users.length > 0 && users.every((user) => selectedUserIds.has(user.uid));
  const someSelected = users.some((user) => selectedUserIds.has(user.uid));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection = new Set(selectedUserIds);
      users.forEach((user) => newSelection.add(user.uid));
      onSelectionChange(newSelection);
    } else {
      const newSelection = new Set(selectedUserIds);
      users.forEach((user) => newSelection.delete(user.uid));
      onSelectionChange(newSelection);
    }
  };

  const handleSelectOne = (uid: string, checked: boolean) => {
    const newSelection = new Set(selectedUserIds);
    if (checked) {
      newSelection.add(uid);
    } else {
      newSelection.delete(uid);
    }
    onSelectionChange(newSelection);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={handleSelectAll}
              aria-label="全て選択"
            />
          </TableHead>
          <TableHead className="w-12"></TableHead>
          <TableHead>ユーザー</TableHead>
          <TableHead>UID</TableHead>
          <TableHead>ロール</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead>作成日時</TableHead>
          <TableHead>最終ログイン</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.uid}>
            <TableCell>
              <Checkbox
                checked={selectedUserIds.has(user.uid)}
                onCheckedChange={(checked) =>
                  handleSelectOne(user.uid, checked === true)
                }
                aria-label={`${user.displayName || user.email || user.uid}を選択`}
              />
            </TableCell>
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
              {user.isAdmin ? (
                <Badge variant="default">管理者</Badge>
              ) : (
                <Badge variant="secondary">ユーザー</Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
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
