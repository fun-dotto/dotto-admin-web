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
import type { SubjectCategory } from "@/app/dotto/subject-categories/constants";

interface SubjectCategoryDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectCategory: SubjectCategory | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function SubjectCategoryDeleteDialog({
  open,
  onOpenChange,
  subjectCategory,
  onConfirm,
  isSubmitting,
}: SubjectCategoryDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>科目群・科目区分を削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{subjectCategory?.name}」を削除します。この操作は取り消せません。
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
