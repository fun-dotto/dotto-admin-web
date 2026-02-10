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
import { SubjectCategoryForm } from "@/components/subject-categories/SubjectCategoryForm";
import { createSubjectCategory } from "../actions";
import type { SubjectCategoryRequest } from "../constants";

export function NewSubjectCategoryPageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: SubjectCategoryRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createSubjectCategory(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目群・科目区分を作成しました");
      router.push("/dotto/subject-categories");
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
              <BreadcrumbLink href="/dotto/subject-categories">
                科目群・科目区分管理
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
            <CardTitle>科目群・科目区分を作成</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectCategoryForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/subject-categories")}
              isSubmitting={isSubmitting}
              isEdit={false}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
