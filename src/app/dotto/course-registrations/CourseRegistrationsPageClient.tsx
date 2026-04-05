"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CourseRegistrationTable } from "@/components/course-registrations/CourseRegistrationTable";
import { CourseRegistrationDeleteDialog } from "@/components/course-registrations/CourseRegistrationDeleteDialog";
import { CourseRegistrationFilterBar } from "@/components/course-registrations/CourseRegistrationFilterBar";
import { deleteRegistration, fetchRegistrations } from "./actions";
import { FilterSemester } from "./constants";
import type { Registration } from "./constants";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";
import { ErrorToast } from "@/components/error-toast";

interface CourseRegistrationsPageClientProps {
  subjects: SubjectSummary[];
  error?: string;
}

export function CourseRegistrationsPageClient({
  subjects,
  error,
}: CourseRegistrationsPageClientProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [userId, setUserId] = useState("");
  const [semester, setSemester] = useState<FilterSemester>(
    FilterSemester.spring,
  );
  const [isSearching, setIsSearching] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Registration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjectMap = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s.name])),
    [subjects],
  );

  const handleSearch = async () => {
    if (!userId.trim()) return;
    setIsSearching(true);
    try {
      const result = await fetchRegistrations(userId.trim(), semester);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setRegistrations(result.registrations);
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteOpen = (registration: Registration) => {
    setDeleteTarget(registration);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteRegistration(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("履修情報を削除しました");
      setDeleteDialogOpen(false);
      setRegistrations((prev) =>
        prev.filter((r) => r.id !== deleteTarget.id),
      );
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
            <span>履修情報管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/course-registrations/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CourseRegistrationFilterBar
            userId={userId}
            onUserIdChange={setUserId}
            semester={semester}
            onSemesterChange={setSemester}
            onSearch={handleSearch}
            isSearching={isSearching}
          />

          {registrations.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              履修情報がありません
            </div>
          ) : (
            <CourseRegistrationTable
              registrations={registrations}
              subjectMap={subjectMap}
              onDelete={handleDeleteOpen}
            />
          )}
        </CardContent>
      </Card>

      <CourseRegistrationDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        registration={deleteTarget}
        subjectName={
          deleteTarget
            ? (subjectMap[deleteTarget.subject.id] ?? deleteTarget.subject.id)
            : ""
        }
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
