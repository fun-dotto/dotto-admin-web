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
import type { Room } from "@/app/dotto/facility-rooms/constants";
import { FLOOR_LABEL } from "@/app/dotto/facility-rooms/constants";

interface RoomTableProps {
  rooms: Room[];
  onDelete: (room: Room) => void;
}

export function RoomTable({ rooms, onDelete }: RoomTableProps) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>教室名</TableHead>
          <TableHead>フロア</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => (
          <TableRow
            key={room.id}
            onClick={() => router.push(`/dotto/facility-rooms/${room.id}/edit`)}
            className="cursor-pointer"
          >
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {room.name}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {FLOOR_LABEL[room.floor]}
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
                    onClick={() => onDelete(room)}
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
