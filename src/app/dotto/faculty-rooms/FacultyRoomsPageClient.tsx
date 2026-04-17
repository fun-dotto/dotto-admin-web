"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FilterBarField,
  FilterBarFormLayout,
} from "@/components/ui/filter-bar-layout";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { FacultyRoomTable } from "@/components/faculty-rooms/FacultyRoomTable";
import { FacultyRoomDeleteDialog } from "@/components/faculty-rooms/FacultyRoomDeleteDialog";
import { deleteFacultyRoom } from "./actions";
import type { FacultyRoom } from "./constants";
import { ErrorToast } from "@/components/error-toast";
import {
  ACADEMIC_YEAR_LABEL,
  ACADEMIC_YEAR_VALUES,
  AcademicYear,
} from "@/lib/academic-year";

interface FacultyRoomsPageClientProps {
  facultyRooms: FacultyRoom[];
  initialYear: AcademicYear;
  error?: string;
}

export function FacultyRoomsPageClient({
  facultyRooms,
  initialYear,
  error,
}: FacultyRoomsPageClientProps) {
  const router = useRouter();
  const [year, setYear] = useState<AcademicYear>(initialYear);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FacultyRoom | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("year", String(year));
    router.push(`/dotto/faculty-rooms?${params.toString()}`);
  };

  const handleDeleteOpen = (facultyRoom: FacultyRoom) => {
    setDeleteTarget(facultyRoom);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteFacultyRoom(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教員室を削除しました");
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
      <ErrorToast error={error} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>教員室管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/faculty-rooms/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[180px_auto]"
          >
            <FilterBarField className="w-full md:w-[180px]">
              <Label htmlFor="facultyRoomYear">年度</Label>
              <Select
                value={String(year)}
                onValueChange={(v) => setYear(Number(v) as AcademicYear)}
              >
                <SelectTrigger id="facultyRoomYear" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEAR_VALUES.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {ACADEMIC_YEAR_LABEL[y]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />
              検索
            </Button>
          </FilterBarFormLayout>
          {facultyRooms.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              教員室がありません
            </div>
          ) : (
            <FacultyRoomTable
              facultyRooms={facultyRooms}
              onDelete={handleDeleteOpen}
            />
          )}
        </CardContent>
      </Card>

      <FacultyRoomDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        facultyRoom={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
