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
import { CourseForm } from "@/components/courses/CourseForm";
import { createCourse } from "../actions";
import type { CourseRequest } from "../constants";

export function NewCoursePageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: CourseRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createCourse(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("コースを作成しました");
      router.push("/dotto/courses");
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
              <BreadcrumbLink href="/dotto/courses">
                コース管理
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
            <CardTitle>コースを作成</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/courses")}
              isSubmitting={isSubmitting}
              isEdit={false}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
