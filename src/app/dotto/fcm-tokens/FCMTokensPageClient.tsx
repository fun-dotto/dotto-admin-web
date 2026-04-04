"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Search } from "lucide-react";
import type { FCMToken } from "./actions";

interface FCMTokensPageClientProps {
  fcmTokens: FCMToken[];
  initialUserIds: string;
  initialTokens: string;
  initialUpdatedAtFrom: string;
  initialUpdatedAtTo: string;
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

export function FCMTokensPageClient({
  fcmTokens,
  initialUserIds,
  initialTokens,
  initialUpdatedAtFrom,
  initialUpdatedAtTo,
}: FCMTokensPageClientProps) {
  const router = useRouter();
  const [userIds, setUserIds] = useState(initialUserIds);
  const [tokens, setTokens] = useState(initialTokens);
  const [updatedAtFrom, setUpdatedAtFrom] = useState(
    toLocalDateTimeInputValue(initialUpdatedAtFrom),
  );
  const [updatedAtTo, setUpdatedAtTo] = useState(
    toLocalDateTimeInputValue(initialUpdatedAtTo),
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (userIds.trim()) params.set("userIds", userIds.trim());
    if (tokens.trim()) params.set("tokens", tokens.trim());
    if (updatedAtFrom) {
      params.set("updatedAtFrom", fromLocalDateTimeInputValue(updatedAtFrom));
    }
    if (updatedAtTo) {
      params.set("updatedAtTo", fromLocalDateTimeInputValue(updatedAtTo));
    }
    const qs = params.toString();
    router.push(qs ? `/dotto/fcm-tokens?${qs}` : "/dotto/fcm-tokens");
  };

  return (
    <AuthenticatedLayout>
      <Card>
        <CardHeader>
          <CardTitle>FCMトークン一覧</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <FilterBarField>
              <Input
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                placeholder="ユーザーID（カンマ区切り）"
              />
            </FilterBarField>
            <FilterBarField>
              <Input
                value={tokens}
                onChange={(e) => setTokens(e.target.value)}
                placeholder="トークン（カンマ区切り）"
              />
            </FilterBarField>
            <FilterBarField>
              <Input
                type="datetime-local"
                value={updatedAtFrom}
                onChange={(e) => setUpdatedAtFrom(e.target.value)}
              />
            </FilterBarField>
            <FilterBarField>
              <Input
                type="datetime-local"
                value={updatedAtTo}
                onChange={(e) => setUpdatedAtTo(e.target.value)}
              />
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />検索
            </Button>
          </FilterBarFormLayout>

          {fcmTokens.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              FCMトークンがありません
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ユーザーID</TableHead>
                  <TableHead>トークン</TableHead>
                  <TableHead>作成日時</TableHead>
                  <TableHead>更新日時</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fcmTokens.map((item) => (
                  <TableRow key={`${item.userId}-${item.token}`}>
                    <TableCell className="font-mono text-xs">{item.userId}</TableCell>
                    <TableCell className="max-w-[420px] truncate font-mono text-xs">
                      {item.token}
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleString("ja-JP")}</TableCell>
                    <TableCell>{new Date(item.updatedAt).toLocaleString("ja-JP")}</TableCell>
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
