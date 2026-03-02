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
import type { TimetableItem } from "@/app/dotto/timetable/constants";
import {
  DAY_OF_WEEK_LABEL,
  PERIOD_LABEL,
} from "@/app/dotto/timetable/constants";

interface TimetableItemDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TimetableItem | null;
  subjectName: string;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function TimetableItemDeleteDialog({
  open,
  onOpenChange,
  item,
  subjectName,
  onConfirm,
  isSubmitting,
}: TimetableItemDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>時間割を削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{subjectName}（{item ? DAY_OF_WEEK_LABEL[item.dayOfWeek] : ""}
            {item ? PERIOD_LABEL[item.period] : ""}）」を削除します。
            この操作は取り消せません。
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
