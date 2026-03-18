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
import { TimetableItemForm } from "@/components/timetable/TimetableItemForm";
import { createTimetableItem } from "../actions";
import type { TimetableItemRequest } from "../constants";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";

interface NewTimetableItemPageClientProps {
  subjects: SubjectSummary[];
}

export function NewTimetableItemPageClient({
  subjects,
}: NewTimetableItemPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: TimetableItemRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createTimetableItem(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("時間割を作成しました");
      router.push("/dotto/timetable");
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
              <BreadcrumbLink href="/dotto/timetable">
                時間割管理
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>新規作成</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>時間割を作成</CardTitle>
          </CardHeader>
          <CardContent>
            <TimetableItemForm
              subjects={subjects}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/timetable")}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
