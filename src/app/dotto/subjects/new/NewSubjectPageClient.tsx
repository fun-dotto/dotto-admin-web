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
import { SubjectForm } from "@/components/subjects/SubjectForm";
import { createSubject } from "../actions";
import type { SubjectRequest } from "../constants";
import type { Course } from "@/app/dotto/courses/constants";
import type { Faculty } from "@/app/dotto/faculties/constants";
import type { SubjectCategory } from "@/app/dotto/subject-categories/constants";
import type { DayOfWeekTimetableSlot } from "@/app/dotto/day-of-week-timetable-slots/constants";

interface NewSubjectPageClientProps {
  courses: Course[];
  faculties: Faculty[];
  subjectCategories: SubjectCategory[];
  dayOfWeekTimetableSlots: DayOfWeekTimetableSlot[];
}

export function NewSubjectPageClient({
  courses,
  faculties,
  subjectCategories,
  dayOfWeekTimetableSlots,
}: NewSubjectPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: SubjectRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createSubject(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目を作成しました");
      router.push("/dotto/subjects");
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
              <BreadcrumbLink href="/dotto/subjects">
                科目管理
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
            <CardTitle>科目を作成</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectForm
              courses={courses}
              faculties={faculties}
              subjectCategories={subjectCategories}
              dayOfWeekTimetableSlots={dayOfWeekTimetableSlots}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/subjects")}
              isSubmitting={isSubmitting}
              isEdit={false}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
