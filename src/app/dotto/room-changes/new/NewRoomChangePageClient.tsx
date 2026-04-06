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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIOD_VALUES, PERIOD_LABEL, type Period } from "@/app/dotto/timetable/constants";
import { createRoomChange, type RoomChangeRequest } from "../actions";

export function NewRoomChangePageClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("");
  const [originalRoomId, setOriginalRoomId] = useState("");
  const [newRoomId, setNewRoomId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const request: RoomChangeRequest = {
        subjectId,
        date,
        period: period as Period,
        originalRoomId,
        newRoomId,
      };
      const result = await createRoomChange(request);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教室変更を作成しました");
      router.push("/dotto/room-changes");
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
              <BreadcrumbLink href="/dotto/room-changes">
                教室変更管理
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
            <CardTitle>教室変更を作成</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjectId">科目ID</Label>
                <Input
                  id="subjectId"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">日付</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>時限</Label>
                <Select value={period} onValueChange={setPeriod} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="時限を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIOD_VALUES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PERIOD_LABEL[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalRoomId">変更前の教室ID</Label>
                <Input
                  id="originalRoomId"
                  value={originalRoomId}
                  onChange={(e) => setOriginalRoomId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newRoomId">変更後の教室ID</Label>
                <Input
                  id="newRoomId"
                  value={newRoomId}
                  onChange={(e) => setNewRoomId(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dotto/room-changes")}
                  disabled={isSubmitting}
                >
                  キャンセル
                </Button>
                <Button type="submit" disabled={isSubmitting || !period}>
                  {isSubmitting ? "処理中..." : "作成"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
