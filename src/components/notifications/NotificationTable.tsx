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
import { Checkbox } from "@/components/ui/checkbox";
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
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[], checked: boolean) => void;
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
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: NotificationTableProps) {
  const sorted = [...notifications].sort(
    (a, b) =>
      new Date(b.notifyAfter).getTime() - new Date(a.notifyAfter).getTime(),
  );
  const sortedIds = sorted.map((n) => n.id);
  const selectedSet = new Set(selectedIds);
  const allSelected =
    sortedIds.length > 0 && sortedIds.every((id) => selectedSet.has(id));
  const someSelected = sortedIds.some((id) => selectedSet.has(id));
  const headerChecked: boolean | "indeterminate" = allSelected
    ? true
    : someSelected
      ? "indeterminate"
      : false;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={headerChecked}
              onCheckedChange={(checked) =>
                onToggleSelectAll(sortedIds, checked === true)
              }
              aria-label="全て選択"
            />
          </TableHead>
          <TableHead>タイトル</TableHead>
          <TableHead>通知送信期間</TableHead>
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
              <TableCell>
                <Checkbox
                  checked={selectedSet.has(notification.id)}
                  onCheckedChange={() => onToggleSelect(notification.id)}
                  aria-label={`${notification.title}を選択`}
                />
              </TableCell>
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                {notification.title}
              </TableCell>
              <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                {formatDateTime(notification.notifyAfter)} 〜{" "}
                {formatDateTime(notification.notifyBefore)}
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
