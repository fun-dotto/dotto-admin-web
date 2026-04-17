"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { FacultyRoom } from "@/app/dotto/faculty-rooms/constants";

interface FacultyRoomDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facultyRoom: FacultyRoom | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function FacultyRoomDeleteDialog({
  open,
  onOpenChange,
  facultyRoom,
  onConfirm,
  isSubmitting,
}: FacultyRoomDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>教員室を削除</AlertDialogTitle>
          <AlertDialogDescription>
            {facultyRoom
              ? `「${facultyRoom.faculty.name} / ${facultyRoom.room.name} (${facultyRoom.year}年度)」を削除します。この操作は取り消せません。`
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "削除中..." : "削除"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
