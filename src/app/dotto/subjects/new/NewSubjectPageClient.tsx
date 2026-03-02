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
import { upsertSubject } from "../actions";
import type { SubjectRequest } from "../constants";

export function NewSubjectPageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: SubjectRequest) => {
    setIsSubmitting(true);
    try {
      const result = await upsertSubject(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目を作成・更新しました");
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
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/subjects")}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
