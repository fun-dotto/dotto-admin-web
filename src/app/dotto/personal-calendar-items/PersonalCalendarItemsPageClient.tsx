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
import { Search, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { PersonalCalendarItem } from "./actions";

const STATUS_LABEL: Record<PersonalCalendarItem["status"], string> = {
  Normal: "通常",
  Cancelled: "休講",
  Makeup: "補講",
  RoomChanged: "教室変更",
};

interface PersonalCalendarItemsPageClientProps {
  items: PersonalCalendarItem[];
  initialUserId: string;
  initialDate: string;
  hasSearched: boolean;
}

export function PersonalCalendarItemsPageClient({
  items,
  initialUserId,
  initialDate,
  hasSearched,
}: PersonalCalendarItemsPageClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [userId, setUserId] = useState(initialUserId);
  const [date, setDate] = useState(initialDate);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !date) return;
    const params = new URLSearchParams({
      userId: userId.trim(),
      date,
    });
    router.push(`/dotto/personal-calendar-items?${params.toString()}`);
  };

  return (
    <AuthenticatedLayout>
      <Card>
        <CardHeader>
          <CardTitle>個人カレンダー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_180px_auto]"
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
              <Label htmlFor="personalCalendarDate">日付</Label>
              <Input
                id="personalCalendarDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />検索
            </Button>
          </FilterBarFormLayout>

          {!hasSearched ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              ユーザーIDと日付を指定して検索してください
            </div>
          ) : items.length === 0 ? (
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
                    <TableCell>{item.period}</TableCell>
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
