"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Search, Trash2, X } from "lucide-react";
import { deleteReservation, type Reservation } from "./actions";

interface ReservationsPageClientProps {
  reservations: Reservation[];
  initialRoomIds: string;
  initialFrom: string;
  initialUntil: string;
}

function toLocalDateTimeInputValue(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromLocalDateTimeInputValue(local: string): string {
  if (!local) return "";
  return new Date(local).toISOString();
}

export function ReservationsPageClient({
  reservations,
  initialRoomIds,
  initialFrom,
  initialUntil,
}: ReservationsPageClientProps) {
  const router = useRouter();
  const [roomIds, setRoomIds] = useState(initialRoomIds);
  const [from, setFrom] = useState(toLocalDateTimeInputValue(initialFrom));
  const [until, setUntil] = useState(toLocalDateTimeInputValue(initialUntil));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (roomIds.trim()) params.set("roomIds", roomIds.trim());
    if (from) params.set("from", fromLocalDateTimeInputValue(from));
    if (until) params.set("until", fromLocalDateTimeInputValue(until));
    const qs = params.toString();
    router.push(qs ? `/dotto/reservations?${qs}` : "/dotto/reservations");
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteReservation(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("予約を削除しました");
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  return (
    <AuthenticatedLayout>
      <Card>
        <CardHeader>
          <CardTitle>予約管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <FilterBarField>
              <Label>教室ID</Label>
              <Input
                value={roomIds}
                onChange={(e) => setRoomIds(e.target.value)}
                placeholder="教室ID（カンマ区切り）"
              />
            </FilterBarField>
            <FilterBarField>
              <Label>開始</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="datetime-local"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="flex-1"
                />
                {from && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setFrom("")}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </FilterBarField>
            <FilterBarField>
              <Label>終了</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="datetime-local"
                  value={until}
                  onChange={(e) => setUntil(e.target.value)}
                  className="flex-1"
                />
                {until && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setUntil("")}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />検索
            </Button>
          </FilterBarFormLayout>

          {reservations.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">予約がありません</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>予約ID</TableHead>
                  <TableHead>教室ID</TableHead>
                  <TableHead>タイトル</TableHead>
                  <TableHead>開始</TableHead>
                  <TableHead>終了</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="font-mono text-xs">{item.roomId}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{new Date(item.startAt).toLocaleString("ja-JP")}</TableCell>
                    <TableCell>{new Date(item.endAt).toLocaleString("ja-JP")}</TableCell>
                    <TableCell>
                      <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </TableCell>
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
