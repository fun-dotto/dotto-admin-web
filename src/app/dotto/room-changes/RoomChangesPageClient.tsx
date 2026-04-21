"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { PERIOD_LABEL, type Period } from "@/app/dotto/timetable/constants";
import { Plus, Search, Trash2, X } from "lucide-react";
import { deleteRoomChange, type RoomChange } from "./actions";
import { ErrorToast } from "@/components/error-toast";

interface RoomChangesPageClientProps {
  roomChanges: RoomChange[];
  initialSubjectIds: string;
  initialFrom: string;
  initialUntil: string;
  error?: string;
}

function toDateInputValue(value: string): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export function RoomChangesPageClient({
  roomChanges,
  initialSubjectIds,
  initialFrom,
  initialUntil,
  error,
}: RoomChangesPageClientProps) {
  const router = useRouter();
  const [subjectIds, setSubjectIds] = useState<string[]>(
    initialSubjectIds ? initialSubjectIds.split(",").map(s => s.trim()).filter(Boolean) : [""]
  );
  const [from, setFrom] = useState(toDateInputValue(initialFrom));
  const [until, setUntil] = useState(toDateInputValue(initialUntil));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const filledIds = subjectIds.filter(id => id.trim());
    if (filledIds.length > 0) params.set("subjectIds", filledIds.join(","));
    if (from) params.set("from", from);
    if (until) params.set("until", until);
    router.push(`/dotto/room-changes?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteRoomChange(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("教室変更を削除しました");
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  return (
    <AuthenticatedLayout
      actions={
        <Button onClick={() => router.push("/dotto/room-changes/new")} size="sm">
          <Plus className="mr-1 size-4" />
          追加
        </Button>
      }
    >
      <ErrorToast error={error} />
      <Card>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <FilterBarField>
              <Label>科目ID</Label>
              <div className="flex flex-col gap-2">
                {subjectIds.map((id, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={id}
                      onChange={(e) => {
                        const newIds = [...subjectIds];
                        newIds[index] = e.target.value;
                        setSubjectIds(newIds);
                      }}
                      placeholder="科目ID"
                    />
                    {subjectIds.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => setSubjectIds(prev => prev.filter((_, i) => i !== index))}
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
                  onClick={() => setSubjectIds(prev => [...prev, ""])}
                >
                  <Plus className="mr-1 size-4" />
                  追加
                </Button>
              </div>
            </FilterBarField>
            <FilterBarField>
              <Label>開始</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="date"
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
                  type="date"
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

          {roomChanges.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">教室変更がありません</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>科目</TableHead>
                  <TableHead>日付</TableHead>
                  <TableHead>時限</TableHead>
                  <TableHead>変更前</TableHead>
                  <TableHead>変更後</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomChanges.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.subject.name}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString("ja-JP")}</TableCell>
                    <TableCell>{PERIOD_LABEL[item.period as Period] ?? item.period}</TableCell>
                    <TableCell>{item.originalRoom.name || "-"}</TableCell>
                    <TableCell>{item.newRoom.name || "-"}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon-sm" variant="ghost">
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>教室変更を削除しますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                              {item.subject.name} ({new Date(item.date).toLocaleDateString("ja-JP")} {PERIOD_LABEL[item.period as Period] ?? item.period}) を削除します。この操作は取り消せません。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => handleDelete(item.id)}>
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
