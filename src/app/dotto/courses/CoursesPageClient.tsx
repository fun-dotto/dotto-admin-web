"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CourseTable } from "@/components/courses/CourseTable";
import { CourseDeleteDialog } from "@/components/courses/CourseDeleteDialog";
import { deleteCourse } from "./actions";
import type { Course } from "./constants";

interface CoursesPageClientProps {
  courses: Course[];
}

export function CoursesPageClient({ courses }: CoursesPageClientProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteOpen = (course: Course) => {
    setDeleteTarget(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteCourse(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("コースを削除しました");
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
            <span>コース管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/courses/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              コースがありません
            </div>
          ) : (
            <CourseTable courses={courses} onDelete={handleDeleteOpen} />
          )}
        </CardContent>
      </Card>

      <CourseDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        course={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
