"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { AnnouncementTable } from "@/components/announcements/AnnouncementTable";
import { AnnouncementFormDialog } from "@/components/announcements/AnnouncementFormDialog";
import { AnnouncementDeleteDialog } from "@/components/announcements/AnnouncementDeleteDialog";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "./actions";
import type { Announcement, AnnouncementRequest } from "./constants";

interface AnnouncementsPageClientProps {
  announcements: Announcement[];
}

export function AnnouncementsPageClient({
  announcements,
}: AnnouncementsPageClientProps) {
  const router = useRouter();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setEditTarget(undefined);
    setFormDialogOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditTarget(announcement);
    setFormDialogOpen(true);
  };

  const handleDeleteOpen = (announcement: Announcement) => {
    setDeleteTarget(announcement);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (request: AnnouncementRequest) => {
    setIsSubmitting(true);
    try {
      if (editTarget) {
        const result = await updateAnnouncement(editTarget.id, request);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("おしらせを更新しました");
      } else {
        const result = await createAnnouncement(request);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("おしらせを作成しました");
      }
      setFormDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>おしらせ管理</span>
            <Button onClick={handleCreate} size="sm">
              <Plus className="mr-1 size-4" />
              新規作成
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
              onEdit={handleEdit}
              onDelete={handleDeleteOpen}
            />
          )}
        </CardContent>
      </Card>

      <AnnouncementFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        announcement={editTarget}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

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
