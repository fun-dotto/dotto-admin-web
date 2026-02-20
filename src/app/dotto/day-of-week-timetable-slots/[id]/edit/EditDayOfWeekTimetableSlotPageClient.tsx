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
import { DayOfWeekTimetableSlotForm } from "@/components/day-of-week-timetable-slots/DayOfWeekTimetableSlotForm";
import { updateDayOfWeekTimetableSlot } from "../../actions";
import type {
  DayOfWeekTimetableSlot,
  DayOfWeekTimetableSlotRequest,
} from "../../constants";

interface EditDayOfWeekTimetableSlotPageClientProps {
  dayOfWeekTimetableSlot: DayOfWeekTimetableSlot;
}

export function EditDayOfWeekTimetableSlotPageClient({
  dayOfWeekTimetableSlot,
}: EditDayOfWeekTimetableSlotPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: DayOfWeekTimetableSlotRequest) => {
    setIsSubmitting(true);
    try {
      const result = await updateDayOfWeekTimetableSlot(
        dayOfWeekTimetableSlot.id,
        request,
      );
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("曜日・時限を更新しました");
      router.push("/dotto/day-of-week-timetable-slots");
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
              <BreadcrumbLink href="/dotto/day-of-week-timetable-slots">
                曜日・時限管理
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
            <CardTitle>曜日・時限を編集</CardTitle>
          </CardHeader>
          <CardContent>
            <DayOfWeekTimetableSlotForm
              dayOfWeekTimetableSlot={dayOfWeekTimetableSlot}
              onSubmit={handleSubmit}
              onCancel={() =>
                router.push("/dotto/day-of-week-timetable-slots")
              }
              isSubmitting={isSubmitting}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
