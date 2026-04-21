"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FacultyRoomForm } from "@/components/faculty-rooms/FacultyRoomForm";
import { ErrorToast } from "@/components/error-toast";
import { createFacultyRoom } from "../actions";
import type { FacultyRoomRequest } from "../constants";
import type { Faculty } from "@/app/dotto/faculties/constants";
import type { Room } from "@/app/dotto/facility-rooms/constants";

interface NewFacultyRoomPageClientProps {
  faculties: Faculty[];
  rooms: Room[];
  error?: string;
}

export function NewFacultyRoomPageClient({
  faculties,
  rooms,
  error,
}: NewFacultyRoomPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: FacultyRoomRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createFacultyRoom(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教員室を作成しました");
      router.push("/dotto/faculty-rooms");
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <ErrorToast error={error} />
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dotto/faculty-rooms">
                教員室管理
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>新規作成</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent>
            <FacultyRoomForm
              faculties={faculties}
              rooms={rooms}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/faculty-rooms")}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
