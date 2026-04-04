"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { FacultyTable } from "@/components/faculties/FacultyTable";
import { FacultyDeleteDialog } from "@/components/faculties/FacultyDeleteDialog";
import { deleteFaculty } from "./actions";
import type { Faculty } from "./constants";

interface FacultiesPageClientProps {
  faculties: Faculty[];
  initialQuery: string;
  hasSearched: boolean;
}

export function FacultiesPageClient({
  faculties,
  initialQuery,
  hasSearched,
}: FacultiesPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Faculty | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }
    const qs = params.toString();
    router.push(qs ? `/dotto/faculties?${qs}` : "/dotto/faculties");
  };

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
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_auto]"
          >
            <FilterBarField className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="教員名で検索"
              />
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />
              検索
            </Button>
          </FilterBarFormLayout>
          {!hasSearched ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              検索条件を指定して検索してください
            </div>
          ) : faculties.length === 0 ? (
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
