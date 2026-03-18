"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { TimetableItem } from "@/app/dotto/timetable/constants";
import {
  DAY_OF_WEEK_LABEL,
  PERIOD_LABEL,
} from "@/app/dotto/timetable/constants";

interface TimetableItemTableProps {
  items: TimetableItem[];
  subjectMap: Record<string, string>;
  onDelete: (item: TimetableItem) => void;
}

export function TimetableItemTable({
  items,
  subjectMap,
  onDelete,
}: TimetableItemTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>科目名</TableHead>
          <TableHead>曜日</TableHead>
          <TableHead>時限</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {subjectMap[item.subject.id] ?? item.subject.id}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {DAY_OF_WEEK_LABEL[item.dayOfWeek]}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {PERIOD_LABEL[item.period]}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 size-4" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
