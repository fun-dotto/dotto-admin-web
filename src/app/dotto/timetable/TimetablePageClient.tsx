"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { TimetableItemTable } from "@/components/timetable/TimetableItemTable";
import { TimetableItemDeleteDialog } from "@/components/timetable/TimetableItemDeleteDialog";
import { TimetableFilterBar } from "@/components/timetable/TimetableFilterBar";
import { deleteTimetableItem, fetchTimetableItems } from "./actions";
import type {
  TimetableItem,
  CourseSemester,
  DayOfWeek,
} from "./constants";
import { DAY_OF_WEEK_VALUES } from "./constants";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";

interface TimetablePageClientProps {
  initialItems: TimetableItem[];
  subjects: SubjectSummary[];
}

export function TimetablePageClient({
  initialItems,
  subjects,
}: TimetablePageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [semester, setSemester] = useState<CourseSemester>("Q1");
  const [selectedDays, setSelectedDays] =
    useState<DayOfWeek[]>(DAY_OF_WEEK_VALUES);
  const [isSearching, setIsSearching] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TimetableItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectMap = useMemo(
    () =>
      Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects],
  );

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const result = await fetchTimetableItems(semester, selectedDays);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setItems(result.items);
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteOpen = (item: TimetableItem) => {
    setDeleteTarget(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteTimetableItem(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("時間割を削除しました");
      setDeleteDialogOpen(false);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
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
            <span>時間割管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/timetable/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TimetableFilterBar
            semester={semester}
            onSemesterChange={setSemester}
            selectedDays={selectedDays}
            onSelectedDaysChange={setSelectedDays}
            onSearch={handleSearch}
            isSearching={isSearching}
          />

          {items.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              時間割がありません
            </div>
          ) : (
            <TimetableItemTable
              items={items}
              subjectMap={subjectMap}
              onDelete={handleDeleteOpen}
            />
          )}
        </CardContent>
      </Card>

      <TimetableItemDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={deleteTarget}
        subjectName={
          deleteTarget ? (subjectMap[deleteTarget.subject.id] ?? deleteTarget.subject.id) : ""
        }
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
