"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DayOfWeekTimetableSlotTable } from "@/components/day-of-week-timetable-slots/DayOfWeekTimetableSlotTable";
import { DayOfWeekTimetableSlotDeleteDialog } from "@/components/day-of-week-timetable-slots/DayOfWeekTimetableSlotDeleteDialog";
import { deleteDayOfWeekTimetableSlot } from "./actions";
import type { DayOfWeekTimetableSlot } from "./constants";

interface DayOfWeekTimetableSlotsPageClientProps {
  dayOfWeekTimetableSlots: DayOfWeekTimetableSlot[];
}

export function DayOfWeekTimetableSlotsPageClient({
  dayOfWeekTimetableSlots,
}: DayOfWeekTimetableSlotsPageClientProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<DayOfWeekTimetableSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteOpen = (slot: DayOfWeekTimetableSlot) => {
    setDeleteTarget(slot);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteDayOfWeekTimetableSlot(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("曜日・時限を削除しました");
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>曜日・時限管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/day-of-week-timetable-slots/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dayOfWeekTimetableSlots.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              曜日・時限がありません
            </div>
          ) : (
            <DayOfWeekTimetableSlotTable
              dayOfWeekTimetableSlots={dayOfWeekTimetableSlots}
              onDelete={handleDeleteOpen}
            />
          )}
        </CardContent>
      </Card>

      <DayOfWeekTimetableSlotDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        dayOfWeekTimetableSlot={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
