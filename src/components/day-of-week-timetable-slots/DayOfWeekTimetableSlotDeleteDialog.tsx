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
import type { DayOfWeekTimetableSlot } from "@/app/dotto/day-of-week-timetable-slots/constants";
import {
  DAY_OF_WEEK_LABEL,
  TIMETABLE_SLOT_LABEL,
} from "@/app/dotto/day-of-week-timetable-slots/constants";

interface DayOfWeekTimetableSlotDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayOfWeekTimetableSlot: DayOfWeekTimetableSlot | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function DayOfWeekTimetableSlotDeleteDialog({
  open,
  onOpenChange,
  dayOfWeekTimetableSlot,
  onConfirm,
  isSubmitting,
}: DayOfWeekTimetableSlotDeleteDialogProps) {
  const label = dayOfWeekTimetableSlot
    ? `${DAY_OF_WEEK_LABEL[dayOfWeekTimetableSlot.dayOfWeek]} ${TIMETABLE_SLOT_LABEL[dayOfWeekTimetableSlot.timetableSlot]}`
    : "";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>曜日・時限を削除</AlertDialogTitle>
          <AlertDialogDescription>
            「{label}」を削除します。この操作は取り消せません。
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
