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
import type { Faculty } from "@/app/dotto/faculties/constants";

interface FacultyDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faculty: Faculty | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function FacultyDeleteDialog({
  open,
  onOpenChange,
  faculty,
  onConfirm,
  isSubmitting,
}: FacultyDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>教員を削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{faculty?.name}」を削除します。この操作は取り消せません。
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
