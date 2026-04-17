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
import type { FacultyRoom } from "@/app/dotto/faculty-rooms/constants";
import { FLOOR_LABEL } from "@/app/dotto/facility-rooms/constants";

interface FacultyRoomTableProps {
  facultyRooms: FacultyRoom[];
  onDelete: (facultyRoom: FacultyRoom) => void;
}

export function FacultyRoomTable({
  facultyRooms,
  onDelete,
}: FacultyRoomTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>教員</TableHead>
          <TableHead>教室</TableHead>
          <TableHead>フロア</TableHead>
          <TableHead>年度</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {facultyRooms.map((facultyRoom) => (
          <TableRow key={facultyRoom.id}>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {facultyRoom.faculty.name}
            </TableCell>
            <TableCell>{facultyRoom.room.name}</TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {FLOOR_LABEL[facultyRoom.room.floor]}
            </TableCell>
            <TableCell>{facultyRoom.year}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDelete(facultyRoom)}
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
