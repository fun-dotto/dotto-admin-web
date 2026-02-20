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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { DayOfWeekTimetableSlot } from "@/app/dotto/day-of-week-timetable-slots/constants";
import {
  DAY_OF_WEEK_LABEL,
  TIMETABLE_SLOT_LABEL,
} from "@/app/dotto/day-of-week-timetable-slots/constants";

interface DayOfWeekTimetableSlotTableProps {
  dayOfWeekTimetableSlots: DayOfWeekTimetableSlot[];
  onDelete: (slot: DayOfWeekTimetableSlot) => void;
}

export function DayOfWeekTimetableSlotTable({
  dayOfWeekTimetableSlots,
  onDelete,
}: DayOfWeekTimetableSlotTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>曜日</TableHead>
          <TableHead>時限</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dayOfWeekTimetableSlots.map((slot) => (
          <TableRow key={slot.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {DAY_OF_WEEK_LABEL[slot.dayOfWeek]}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {TIMETABLE_SLOT_LABEL[slot.timetableSlot]}
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
                      href={`/dotto/day-of-week-timetable-slots/${slot.id}/edit`}
                    >
                      <Pencil className="mr-2 size-4" />
                      編集
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(slot)}
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
