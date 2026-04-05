"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AnnouncementTable } from "@/components/announcements/AnnouncementTable";
import { AnnouncementDeleteDialog } from "@/components/announcements/AnnouncementDeleteDialog";
import { deleteAnnouncement } from "./actions";
import type { Announcement } from "./constants";
import { ErrorToast } from "@/components/error-toast";

interface AnnouncementsPageClientProps {
  announcements: Announcement[];
  error?: string;
}

export function AnnouncementsPageClient({
  announcements,
  error,
}: AnnouncementsPageClientProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteOpen = (announcement: Announcement) => {
    setDeleteTarget(announcement);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteAnnouncement(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("おしらせを削除しました");
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
            <span>おしらせ管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/announcements/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              おしらせがありません
            </div>
          ) : (
            <AnnouncementTable
              announcements={announcements}
              onDelete={handleDeleteOpen}
            />
          )}
        </CardContent>
      </Card>

      <AnnouncementDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        announcement={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
