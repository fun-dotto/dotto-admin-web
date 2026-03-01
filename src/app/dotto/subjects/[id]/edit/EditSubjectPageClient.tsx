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
import { updateSubject } from "../../actions";
import type { Subject, SubjectRequest } from "../../constants";

interface EditSubjectPageClientProps {
  subject: Subject;
}

export function EditSubjectPageClient({
  subject,
}: EditSubjectPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: SubjectRequest) => {
    setIsSubmitting(true);
    try {
      const result = await updateSubject(subject.id, request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目を更新しました");
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
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>科目を編集</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/subjects")}
              isSubmitting={isSubmitting}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
