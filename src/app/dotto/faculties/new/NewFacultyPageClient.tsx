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
import { FacultyForm } from "@/components/faculties/FacultyForm";
import { createFaculty } from "../actions";
import type { FacultyRequest } from "../constants";

export function NewFacultyPageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: FacultyRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createFaculty(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教員を作成しました");
      router.push("/dotto/faculties");
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
              <BreadcrumbLink href="/dotto/faculties">
                教員管理
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
            <CardTitle>教員を作成</CardTitle>
          </CardHeader>
          <CardContent>
            <FacultyForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/faculties")}
              isSubmitting={isSubmitting}
              isEdit={false}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
