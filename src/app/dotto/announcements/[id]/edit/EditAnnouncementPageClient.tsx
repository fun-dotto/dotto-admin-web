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
import { AnnouncementForm } from "@/components/announcements/AnnouncementForm";
import { updateAnnouncement } from "../../actions";
import type { Announcement, AnnouncementRequest } from "../../constants";

interface EditAnnouncementPageClientProps {
  announcement: Announcement;
}

export function EditAnnouncementPageClient({
  announcement,
}: EditAnnouncementPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (request: AnnouncementRequest) => {
    setIsSubmitting(true);
    try {
      const result = await updateAnnouncement(announcement.id, request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("おしらせを更新しました");
      router.push("/dotto/announcements");
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
              <BreadcrumbLink href="/dotto/announcements">
                おしらせ管理
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
            <CardTitle>おしらせを編集</CardTitle>
          </CardHeader>
          <CardContent>
            <AnnouncementForm
              announcement={announcement}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/dotto/announcements")}
              isSubmitting={isSubmitting}
              isEdit={true}
            />
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
