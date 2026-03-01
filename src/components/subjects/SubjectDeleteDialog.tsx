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
import type { SubjectSummary } from "@/app/dotto/subjects/constants";

interface SubjectDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: SubjectSummary | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function SubjectDeleteDialog({
  open,
  onOpenChange,
  subject,
  onConfirm,
  isSubmitting,
}: SubjectDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>科目を削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{subject?.name}」を削除します。この操作は取り消せません。
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
