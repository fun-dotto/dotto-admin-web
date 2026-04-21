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
import type { Faculty } from "@/app/dotto/faculties/constants";

interface FacultyTableProps {
  faculties: Faculty[];
  onDelete: (faculty: Faculty) => void;
}

export function FacultyTable({ faculties, onDelete }: FacultyTableProps) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名前</TableHead>
          <TableHead>メールアドレス</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {faculties.map((faculty) => (
          <TableRow
            key={faculty.id}
            onClick={() => router.push(`/dotto/faculties/${faculty.id}/edit`)}
            className="cursor-pointer"
          >
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {faculty.name}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {faculty.email}
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
                    onClick={() => onDelete(faculty)}
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
