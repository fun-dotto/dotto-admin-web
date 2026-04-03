"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notifyIrregularities } from "./actions";

export function NotifyIrregularitiesPageClient() {
  const [date, setDate] = useState("");
  const [userIds, setUserIds] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setIsSubmitting(true);
    try {
      const parsedUserIds = userIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      const result = await notifyIrregularities(
        new Date(date).toISOString(),
        parsedUserIds.length > 0 ? parsedUserIds : undefined,
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("イレギュラー通知を送信しました");
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <Card>
        <CardHeader>
          <CardTitle>イレギュラー通知</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
              placeholder="ユーザーID（カンマ区切り、空欄で全ユーザー）"
            />
            <Button type="submit" disabled={isSubmitting || !date}>
              {isSubmitting ? "送信中..." : "通知を送信"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
