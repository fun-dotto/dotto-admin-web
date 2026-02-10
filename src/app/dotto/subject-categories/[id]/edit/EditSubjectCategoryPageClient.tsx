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
import { updateSubjectCategory } from "../../actions";
import type { SubjectCategory, SubjectCategoryRequest } from "../../constants";

interface EditSubjectCategoryPageClientProps {
  subjectCategory: SubjectCategory;
}

export function EditSubjectCategoryPageClient({
  subjectCategory,
}: EditSubjectCategoryPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: SubjectCategoryRequest) => {
    setIsSubmitting(true);
    try {
      const result = await updateSubjectCategory(subjectCategory.id, request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目群・科目区分を更新しました");
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
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>科目群・科目区分を編集</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectCategoryForm
              subjectCategory={subjectCategory}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/subject-categories")}
              isSubmitting={isSubmitting}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
