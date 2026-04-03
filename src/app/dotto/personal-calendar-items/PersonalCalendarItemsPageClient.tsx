"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
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
          <form onSubmit={handleSearch} className="grid gap-3 md:grid-cols-3">
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ユーザーID"
              required
            />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <Button type="submit">
              <Search className="mr-1 size-4" />検索
            </Button>
          </form>

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
