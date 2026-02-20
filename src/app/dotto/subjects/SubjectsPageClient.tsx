"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { SubjectTable } from "@/components/subjects/SubjectTable";
import { SubjectDeleteDialog } from "@/components/subjects/SubjectDeleteDialog";
import { deleteSubject } from "./actions";
import type { Subject } from "./constants";

interface SubjectsPageClientProps {
  subjects: Subject[];
}

export function SubjectsPageClient({ subjects }: SubjectsPageClientProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteOpen = (subject: Subject) => {
    setDeleteTarget(subject);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteSubject(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目を削除しました");
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
            <span>科目管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/subjects/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              科目がありません
            </div>
          ) : (
            <SubjectTable subjects={subjects} onDelete={handleDeleteOpen} />
          )}
        </CardContent>
      </Card>

      <SubjectDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        subject={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
