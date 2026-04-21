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
import { CourseRegistrationForm } from "@/components/course-registrations/CourseRegistrationForm";
import { createRegistration } from "../actions";
import type { RegistrationRequest } from "../constants";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";

interface NewCourseRegistrationPageClientProps {
  subjects: SubjectSummary[];
}

export function NewCourseRegistrationPageClient({
  subjects,
}: NewCourseRegistrationPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: RegistrationRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createRegistration(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("履修情報を作成しました");
      router.push("/dotto/course-registrations");
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
              <BreadcrumbLink href="/dotto/course-registrations">
                履修情報
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
            <CourseRegistrationForm
              subjects={subjects}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/course-registrations")}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
