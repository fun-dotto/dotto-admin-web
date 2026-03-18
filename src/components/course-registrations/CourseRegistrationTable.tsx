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
import type { Registration } from "@/app/dotto/course-registrations/constants";

interface CourseRegistrationTableProps {
  registrations: Registration[];
  subjectMap: Record<string, string>;
  onDelete: (registration: Registration) => void;
}

export function CourseRegistrationTable({
  registrations,
  subjectMap,
  onDelete,
}: CourseRegistrationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ユーザーID</TableHead>
          <TableHead>科目名</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((reg) => (
          <TableRow key={reg.id}>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {reg.userId}
            </TableCell>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {subjectMap[reg.subject.id] ?? reg.subject.id}
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
                    onClick={() => onDelete(reg)}
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
