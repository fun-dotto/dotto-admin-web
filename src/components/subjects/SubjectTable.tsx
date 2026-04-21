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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";
import { SEMESTER_LABEL } from "@/app/dotto/subjects/constants";

interface SubjectTableProps {
  subjects: SubjectSummary[];
  onDelete: (subject: SubjectSummary) => void;
}

export function SubjectTable({ subjects, onDelete }: SubjectTableProps) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>科目名</TableHead>
          <TableHead>年度</TableHead>
          <TableHead>開講時期</TableHead>
          <TableHead>教員</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => (
          <TableRow
            key={subject.id}
            onClick={() => router.push(`/dotto/subjects/${subject.id}`)}
            className="cursor-pointer"
          >
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {subject.name}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {subject.year}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {SEMESTER_LABEL[subject.semester]}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {subject.faculties.length <= 1
                ? subject.faculties.map((f) => f.faculty.name).join("")
                : `${subject.faculties[0].faculty.name} 他${subject.faculties.length - 1}人`}
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
