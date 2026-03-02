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
import type { Registration } from "@/app/dotto/course-registrations/constants";

interface CourseRegistrationDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: Registration | null;
  subjectName: string;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function CourseRegistrationDeleteDialog({
  open,
  onOpenChange,
  registration,
  subjectName,
  onConfirm,
  isSubmitting,
}: CourseRegistrationDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>履修情報を削除</AlertDialogTitle>
          <AlertDialogDescription>
            ユーザー「{registration?.userId}」の「{subjectName}
            」の履修情報を削除します。この操作は取り消せません。
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
