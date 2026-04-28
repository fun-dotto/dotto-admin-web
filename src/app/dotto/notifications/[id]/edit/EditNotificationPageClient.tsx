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
import { NotificationForm } from "@/components/notifications/NotificationForm";
import { NotificationTargetUsersTable } from "@/components/notifications/NotificationTargetUsersTable";
import { updateNotification } from "../../actions";
import type { Notification, NotificationRequest } from "../../constants";

interface EditNotificationPageClientProps {
  notification: Notification;
}

export function EditNotificationPageClient({
  notification,
}: EditNotificationPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: NotificationRequest) => {
    setIsSubmitting(true);
    try {
      const result = await updateNotification(notification.id, request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("通知を更新しました");
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
                通知
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>編集</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent>
            <NotificationForm
              notification={notification}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/notifications")}
              isSubmitting={isSubmitting}
              isEdit={true}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2">
            <h2 className="text-sm font-medium">対象ユーザーの送信状況</h2>
            <NotificationTargetUsersTable
              targetUsers={notification.targetUsers}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
