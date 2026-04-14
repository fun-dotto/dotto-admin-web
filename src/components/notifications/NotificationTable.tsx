"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Notification } from "@/app/dotto/notifications/constants";
import {
  getNotificationStatus,
  STATUS_LABEL,
  STATUS_BADGE_VARIANT,
} from "@/app/dotto/notifications/constants";

interface NotificationTableProps {
  notifications: Notification[];
  onDelete: (notification: Notification) => void;
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

export function NotificationTable({
  notifications,
  onDelete,
}: NotificationTableProps) {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.notifyAt).getTime() - new Date(a.notifyAt).getTime(),
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>タイトル</TableHead>
          <TableHead>通知予定日時</TableHead>
          <TableHead>対象人数</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((notification) => {
          const status = getNotificationStatus(notification);
          return (
            <TableRow key={notification.id}>
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                {notification.title}
              </TableCell>
              <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                {formatDateTime(notification.notifyAt)}
              </TableCell>
              <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                {notification.targetUserIds.length}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_BADGE_VARIANT[status]}>
                  {STATUS_LABEL[status]}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dotto/notifications/${notification.id}/edit`}
                      >
                        <Pencil className="mr-2 size-4" />
                        編集
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(notification)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2 size-4" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
