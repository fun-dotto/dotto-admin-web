"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { SubjectTable } from "@/components/subjects/SubjectTable";
import { SubjectDeleteDialog } from "@/components/subjects/SubjectDeleteDialog";
import { deleteSubject } from "./actions";
import type { SubjectSummary } from "./constants";

interface SubjectsPageClientProps {
  subjects: SubjectSummary[];
  initialQuery: string;
}

export function SubjectsPageClient({
  subjects,
  initialQuery,
}: SubjectsPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubjectSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }
    const qs = params.toString();
    router.push(qs ? `/dotto/subjects?${qs}` : "/dotto/subjects");
  };

  const handleDeleteOpen = (subject: SubjectSummary) => {
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
          <CardTitle>科目管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="科目名で検索"
              />
            </div>
            <Button type="submit">
              <Search className="mr-1 size-4" />
              検索
            </Button>
          </form>
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
