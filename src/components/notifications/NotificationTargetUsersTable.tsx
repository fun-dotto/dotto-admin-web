"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "@/app/dotto/notifications/constants";

interface NotificationTargetUsersTableProps {
  targetUsers: Notification["targetUsers"];
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationTargetUsersTable({
  targetUsers,
}: NotificationTargetUsersTableProps) {
  const router = useRouter();

  if (targetUsers.length === 0) {
    return (
      <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
        対象ユーザーがいません
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ユーザーID</TableHead>
          <TableHead>送信日時</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {targetUsers.map((user) => (
          <TableRow
            key={user.userId}
            onClick={() => router.push(`/dotto/users/${user.userId}`)}
            className="cursor-pointer"
          >
            <TableCell className="font-mono text-sm">{user.userId}</TableCell>
            <TableCell>
              {user.notifiedAt ? (
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {formatDateTime(user.notifiedAt)}
                </span>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  未送信
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
