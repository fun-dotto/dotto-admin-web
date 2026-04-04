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
import { Search, RefreshCw, Trash2 } from "lucide-react";
import {
  deleteMakeupClass,
  fetchFromAcademicSystem,
  type MakeupClass,
} from "./actions";

interface MakeupClassesPageClientProps {
  makeupClasses: MakeupClass[];
  initialSubjectIds: string;
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

export function MakeupClassesPageClient({
  makeupClasses,
  initialSubjectIds,
  initialFrom,
  initialUntil,
}: MakeupClassesPageClientProps) {
  const router = useRouter();
  const [subjectIds, setSubjectIds] = useState(initialSubjectIds);
  const [from, setFrom] = useState(toLocalDateTimeInputValue(initialFrom));
  const [until, setUntil] = useState(toLocalDateTimeInputValue(initialUntil));
  const [isFetching, setIsFetching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (subjectIds.trim()) params.set("subjectIds", subjectIds.trim());
    if (from) params.set("from", fromLocalDateTimeInputValue(from));
    if (until) params.set("until", fromLocalDateTimeInputValue(until));
    const qs = params.toString();
    router.push(qs ? `/dotto/makeup-classes?${qs}` : "/dotto/makeup-classes");
  };

  const handleFetch = async () => {
    setIsFetching(true);
    try {
      const result = await fetchFromAcademicSystem();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${result.fetched.length}件の補講を取得しました`);
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMakeupClass(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("補講を削除しました");
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    }
  };

  return (
    <AuthenticatedLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>補講管理</span>
            <Button variant="outline" onClick={handleFetch} disabled={isFetching}>
              <RefreshCw className="mr-1 size-4" />
              {isFetching ? "取得中..." : "教務から取得"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <FilterBarField>
              <Input
                value={subjectIds}
                onChange={(e) => setSubjectIds(e.target.value)}
                placeholder="科目ID（カンマ区切り）"
              />
            </FilterBarField>
            <FilterBarField>
              <Input
                type="datetime-local"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </FilterBarField>
            <FilterBarField>
              <Input
                type="datetime-local"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />検索
            </Button>
          </FilterBarFormLayout>

          {makeupClasses.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">補講がありません</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>科目</TableHead>
                  <TableHead>日時</TableHead>
                  <TableHead>時限</TableHead>
                  <TableHead>コメント</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {makeupClasses.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.subject.name}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleString("ja-JP")}</TableCell>
                    <TableCell>{item.period}</TableCell>
                    <TableCell>{item.comment}</TableCell>
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
