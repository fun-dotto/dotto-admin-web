"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { FacultyTable } from "@/components/faculties/FacultyTable";
import { FacultyDeleteDialog } from "@/components/faculties/FacultyDeleteDialog";
import { deleteFaculty } from "./actions";
import type { Faculty } from "./constants";

interface FacultiesPageClientProps {
  faculties: Faculty[];
}

export function FacultiesPageClient({ faculties }: FacultiesPageClientProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Faculty | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteOpen = (faculty: Faculty) => {
    setDeleteTarget(faculty);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteFaculty(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教員を削除しました");
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
            <span>教員管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/faculties/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {faculties.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              教員がありません
            </div>
          ) : (
            <FacultyTable faculties={faculties} onDelete={handleDeleteOpen} />
          )}
        </CardContent>
      </Card>

      <FacultyDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        faculty={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
