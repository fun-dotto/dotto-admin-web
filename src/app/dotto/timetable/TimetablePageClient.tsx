"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid3X3, List, Plus } from "lucide-react";
import { TimetableItemTable } from "@/components/timetable/TimetableItemTable";
import { TimetableGridView } from "@/components/timetable/TimetableGridView";
import { TimetableItemDeleteDialog } from "@/components/timetable/TimetableItemDeleteDialog";
import { TimetableFilterBar } from "@/components/timetable/TimetableFilterBar";
import { deleteTimetableItem, fetchTimetableItems } from "./actions";
import type {
  TimetableItem,
  TimetableSemester,
} from "./constants";
import {
  TimetableSemester as TimetableSemesterEnum,
} from "./constants";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";
import { ErrorToast } from "@/components/error-toast";

interface TimetablePageClientProps {
  initialItems: TimetableItem[];
  initialYear: number;
  subjects: SubjectSummary[];
  error?: string;
}

export function TimetablePageClient({
  initialItems,
  initialYear,
  subjects,
  error,
}: TimetablePageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [year, setYear] = useState(initialYear);
  const [timetableSemester, setTimetableSemester] = useState<TimetableSemester>(
    TimetableSemesterEnum.spring,
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
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
      const result = await fetchTimetableItems(year, timetableSemester);
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

  useEffect(() => {
    handleSearch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <ErrorToast error={error} />
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
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <TimetableFilterBar
                year={year}
                onYearChange={setYear}
                timetableSemester={timetableSemester}
                onTimetableSemesterChange={setTimetableSemester}
                onSearch={handleSearch}
                isSearching={isSearching}
              />
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon-sm"
                onClick={() => setViewMode("list")}
                aria-label="リスト表示"
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon-sm"
                onClick={() => setViewMode("grid")}
                aria-label="グリッド表示"
              >
                <Grid3X3 className="size-4" />
              </Button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              時間割がありません
            </div>
          ) : viewMode === "list" ? (
            <TimetableItemTable
              items={items}
              subjectMap={subjectMap}
              onDelete={handleDeleteOpen}
            />
          ) : (
            <TimetableGridView
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
