"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PERIOD_LABEL, type Period } from "@/app/dotto/timetable/constants";
import { Plus, Search, UserRound, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { PersonalCalendarItem } from "./actions";
import { ErrorToast } from "@/components/error-toast";

const STATUS_LABEL: Record<PersonalCalendarItem["status"], string> = {
  Normal: "通常",
  Cancelled: "休講",
  Makeup: "補講",
  RoomChanged: "教室変更",
};

interface PersonalCalendarItemsPageClientProps {
  items: PersonalCalendarItem[];
  initialUserId: string;
  initialDates: string[];
  error?: string;
}

export function PersonalCalendarItemsPageClient({
  items,
  initialUserId,
  initialDates,
  error,
}: PersonalCalendarItemsPageClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [userId, setUserId] = useState(initialUserId);
  const [dates, setDates] = useState<string[]>(
    initialDates.length > 0 ? initialDates : [""],
  );

  const handleDateChange = (index: number, value: string) => {
    setDates((prev) => prev.map((d, i) => (i === index ? value : d)));
  };

  const handleAddDate = () => {
    setDates((prev) => [...prev, ""]);
  };

  const handleRemoveDate = (index: number) => {
    setDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filledDates = dates.filter((d) => d);
    if (!userId.trim() || filledDates.length === 0) return;
    const params = new URLSearchParams({
      userId: userId.trim(),
      dates: filledDates.join(","),
    });
    router.push(`/dotto/personal-calendar-items?${params.toString()}`);
  };

  return (
    <AuthenticatedLayout>
      <ErrorToast error={error} />
      <Card>
        <CardHeader>
          <CardTitle>個人カレンダー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <FilterBarField>
              <Label htmlFor="personalCalendarUserId">ユーザーID</Label>
              <div className="flex gap-1">
                <Input
                  id="personalCalendarUserId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="ユーザーID"
                  required
                />
                {user && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setUserId(user.uid)}
                    title="自分自身を設定"
                  >
                    <UserRound className="size-4" />
                  </Button>
                )}
              </div>
            </FilterBarField>
            <FilterBarField>
              <Label>日付</Label>
              <div className="flex flex-col gap-2">
                {dates.map((date, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                      required
                    />
                    {dates.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => handleRemoveDate(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={handleAddDate}
                >
                  <Plus className="mr-1 size-4" />
                  日付を追加
                </Button>
              </div>
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />検索
            </Button>
          </FilterBarFormLayout>

          {items.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              該当データがありません
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>時限</TableHead>
                  <TableHead>科目</TableHead>
                  <TableHead>教室</TableHead>
                  <TableHead>状態</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.date}-${item.period}-${item.subject.id}`}>
                    <TableCell>{new Date(item.date).toLocaleDateString("ja-JP")}</TableCell>
                    <TableCell>{PERIOD_LABEL[item.period as Period] ?? item.period}</TableCell>
                    <TableCell>{item.subject.name}</TableCell>
                    <TableCell>{item.rooms.map((room) => room.name).join(", ")}</TableCell>
                    <TableCell>{STATUS_LABEL[item.status]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
