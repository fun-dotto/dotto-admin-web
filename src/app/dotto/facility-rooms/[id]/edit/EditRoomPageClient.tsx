"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RoomForm } from "@/components/facility-rooms/RoomForm";
import { updateRoom } from "../../actions";
import type { Room, RoomRequest } from "../../constants";

interface EditRoomPageClientProps {
  room: Room;
}

export function EditRoomPageClient({ room }: EditRoomPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: RoomRequest) => {
    setIsSubmitting(true);
    try {
      const result = await updateRoom(room.id, request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教室を更新しました");
      router.push("/dotto/facility-rooms");
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dotto/facility-rooms">
                教室管理
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>教室を編集</CardTitle>
          </CardHeader>
          <CardContent>
            <RoomForm
              room={room}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/facility-rooms")}
              isSubmitting={isSubmitting}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
