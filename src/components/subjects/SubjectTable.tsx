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
import type { Subject } from "@/app/dotto/subjects/constants";
import { SEMESTER_LABEL } from "@/app/dotto/subjects/constants";
import {
  DAY_OF_WEEK_LABEL,
  TIMETABLE_SLOT_LABEL,
} from "@/app/dotto/day-of-week-timetable-slots/constants";

interface SubjectTableProps {
  subjects: Subject[];
  onDelete: (subject: Subject) => void;
}

export function SubjectTable({ subjects, onDelete }: SubjectTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>科目名</TableHead>
          <TableHead>教員</TableHead>
          <TableHead>開講時期</TableHead>
          <TableHead>曜日・時限</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {subject.name}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {subject.faculty.name}
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {SEMESTER_LABEL[subject.semester]}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {subject.dayOfWeekTimetableSlots
                .map(
                  (slot) =>
                    `${DAY_OF_WEEK_LABEL[slot.dayOfWeek]}${TIMETABLE_SLOT_LABEL[slot.timetableSlot]}`,
                )
                .join(", ")}
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
                    <Link href={`/dotto/subjects/${subject.id}/edit`}>
                      <Pencil className="mr-2 size-4" />
                      編集
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(subject)}
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
