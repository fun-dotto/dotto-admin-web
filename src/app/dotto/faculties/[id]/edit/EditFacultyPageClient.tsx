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
import { updateFaculty } from "../../actions";
import type { Faculty, FacultyRequest } from "../../constants";

interface EditFacultyPageClientProps {
  faculty: Faculty;
}

export function EditFacultyPageClient({ faculty }: EditFacultyPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: FacultyRequest) => {
    setIsSubmitting(true);
    try {
      const result = await updateFaculty(faculty.id, request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教員を更新しました");
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
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>教員を編集</CardTitle>
          </CardHeader>
          <CardContent>
            <FacultyForm
              faculty={faculty}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/faculties")}
              isSubmitting={isSubmitting}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
