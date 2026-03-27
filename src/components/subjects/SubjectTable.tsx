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
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";

interface SubjectTableProps {
  subjects: SubjectSummary[];
  onDelete: (subject: SubjectSummary) => void;
}

export function SubjectTable({ subjects, onDelete }: SubjectTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>科目名</TableHead>
          <TableHead>教員</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              <Link
                href={`/dotto/subjects/${subject.id}`}
                className="hover:underline"
              >
                {subject.name}
              </Link>
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {subject.faculties
                .map((f) => f.faculty.name)
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
                    <Link href={`/dotto/subjects/${subject.id}`}>
                      <Eye className="mr-2 size-4" />
                      詳細
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
