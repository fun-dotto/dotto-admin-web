"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { RoomTable } from "@/components/facility-rooms/RoomTable";
import { RoomDeleteDialog } from "@/components/facility-rooms/RoomDeleteDialog";
import { deleteRoom } from "./actions";
import { FLOOR_LABEL, FLOOR_VALUES, type Floor, type Room } from "./constants";

interface FacilityRoomsPageClientProps {
  rooms: Room[];
  initialQuery: string;
  initialFloor?: Floor;
}

export function FacilityRoomsPageClient({
  rooms,
  initialQuery,
  initialFloor,
}: FacilityRoomsPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [floor, setFloor] = useState<Floor | "all">(initialFloor ?? "all");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }
    if (floor !== "all") {
      params.set("floor", floor);
    }
    const qs = params.toString();
    router.push(qs ? `/dotto/facility-rooms?${qs}` : "/dotto/facility-rooms");
  };

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
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex items-end gap-3">
            <div className="flex-1">
              <Label htmlFor="roomQuery">検索</Label>
              <Input
                id="roomQuery"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="教室名・教室番号・教員名で検索"
              />
            </div>
            <div className="w-[180px]">
              <Label htmlFor="roomFloor">フロア</Label>
              <Select
                value={floor}
                onValueChange={(value) => setFloor(value as Floor | "all")}
              >
                <SelectTrigger id="roomFloor">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {FLOOR_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {FLOOR_LABEL[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              <Search className="mr-1 size-4" />
              検索
            </Button>
          </form>
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
