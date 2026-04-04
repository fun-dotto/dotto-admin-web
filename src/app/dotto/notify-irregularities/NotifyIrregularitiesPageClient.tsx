"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <FilterBarFormLayout
            onSubmit={handleSubmit}
            className="md:grid-cols-[minmax(0,1fr)_180px_auto]"
          >
            <FilterBarField>
              <Label htmlFor="notifyUserIds">ユーザーID</Label>
              <Input
                id="notifyUserIds"
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                placeholder="カンマ区切り、空欄で全ユーザー"
              />
            </FilterBarField>
            <FilterBarField>
              <Label htmlFor="notifyDate">日付</Label>
              <Input
                id="notifyDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting || !date}>
              {isSubmitting ? "送信中..." : "通知を送信"}
            </Button>
          </FilterBarFormLayout>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
