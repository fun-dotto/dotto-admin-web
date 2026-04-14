"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NotificationForm } from "@/components/notifications/NotificationForm";
import { createNotification } from "../actions";
import type { NotificationRequest } from "../constants";

export function NewNotificationPageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: NotificationRequest) => {
    setIsSubmitting(true);
    try {
      const result = await createNotification(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("通知を作成しました");
      router.push("/dotto/notifications");
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
              <BreadcrumbLink href="/dotto/notifications">
                通知管理
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
            <CardTitle>通知を作成</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationForm
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/notifications")}
              isSubmitting={isSubmitting}
              isEdit={false}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
