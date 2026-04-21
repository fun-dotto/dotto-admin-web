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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import type { Announcement } from "@/app/dotto/announcements/constants";
import {
  getAnnouncementStatus,
  STATUS_LABEL,
  STATUS_BADGE_VARIANT,
} from "@/app/dotto/announcements/constants";

interface AnnouncementTableProps {
  announcements: Announcement[];
  onDelete: (announcement: Announcement) => void;
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

function truncateUrl(url: string, maxLength: number = 40): string {
  try {
    const parsed = new URL(url);
    const display = parsed.host + parsed.pathname;
    return display.length > maxLength
      ? display.slice(0, maxLength) + "..."
      : display;
  } catch {
    return url.length > maxLength ? url.slice(0, maxLength) + "..." : url;
  }
}

export function AnnouncementTable({
  announcements,
  onDelete,
}: AnnouncementTableProps) {
  const router = useRouter();
  const sorted = [...announcements].sort(
    (a, b) =>
      new Date(b.availableFrom).getTime() - new Date(a.availableFrom).getTime()
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>タイトル</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>公開開始</TableHead>
          <TableHead>公開終了</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((announcement) => {
          const status = getAnnouncementStatus(announcement);
          return (
            <TableRow
              key={announcement.id}
              onClick={() =>
                router.push(`/dotto/announcements/${announcement.id}/edit`)
              }
              className="cursor-pointer"
            >
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                {announcement.title}
              </TableCell>
              <TableCell>
                <a
                  href={announcement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {truncateUrl(announcement.url)}
                  <ExternalLink className="size-3" />
                </a>
              </TableCell>
              <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                {formatDateTime(announcement.availableFrom)}
              </TableCell>
              <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
                {announcement.availableUntil
                  ? formatDateTime(announcement.availableUntil)
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_BADGE_VARIANT[status]}>
                  {STATUS_LABEL[status]}
                </Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onDelete(announcement)}
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
