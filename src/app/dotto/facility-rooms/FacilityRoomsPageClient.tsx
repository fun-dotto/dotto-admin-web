"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { RoomTable } from "@/components/facility-rooms/RoomTable";
import { RoomDeleteDialog } from "@/components/facility-rooms/RoomDeleteDialog";
import { deleteRoom } from "./actions";
import type { Room } from "./constants";

interface FacilityRoomsPageClientProps {
  rooms: Room[];
}

export function FacilityRoomsPageClient({
  rooms,
}: FacilityRoomsPageClientProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteOpen = (room: Room) => {
    setDeleteTarget(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteRoom(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教室を削除しました");
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
            <span>教室管理</span>
            <Button asChild size="sm">
              <Link href="/dotto/facility-rooms/new">
                <Plus className="mr-1 size-4" />
                新規作成
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              教室がありません
            </div>
          ) : (
            <RoomTable rooms={rooms} onDelete={handleDeleteOpen} />
          )}
        </CardContent>
      </Card>

      <RoomDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        room={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
