"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { SubjectCategoryTable } from "@/components/subject-categories/SubjectCategoryTable";
import { SubjectCategoryDeleteDialog } from "@/components/subject-categories/SubjectCategoryDeleteDialog";
import { deleteSubjectCategory } from "./actions";
import type { SubjectCategory } from "./constants";

interface SubjectCategoriesPageClientProps {
  subjectCategories: SubjectCategory[];
}

export function SubjectCategoriesPageClient({
  subjectCategories,
}: SubjectCategoriesPageClientProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubjectCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteOpen = (subjectCategory: SubjectCategory) => {
    setDeleteTarget(subjectCategory);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteSubjectCategory(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目群・科目区分を削除しました");
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
            <span>科目群・科目区分管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/subject-categories/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjectCategories.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              科目群・科目区分がありません
            </div>
          ) : (
            <SubjectCategoryTable
              subjectCategories={subjectCategories}
              onDelete={handleDeleteOpen}
            />
          )}
        </CardContent>
      </Card>

      <SubjectCategoryDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        subjectCategory={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
