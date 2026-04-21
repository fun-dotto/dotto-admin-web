"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FilterBarField,
  FilterBarFormLayout,
} from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Send, X } from "lucide-react";
import { NotificationTable } from "@/components/notifications/NotificationTable";
import { NotificationDeleteDialog } from "@/components/notifications/NotificationDeleteDialog";
import { NotificationDispatchDialog } from "@/components/notifications/NotificationDispatchDialog";
import { deleteNotification, dispatchNotifications } from "./actions";
import type { Notification } from "./constants";
import { ErrorToast } from "@/components/error-toast";

interface NotificationsPageClientProps {
  notifications: Notification[];
  initialNotifyAtFrom: string;
  initialNotifyAtTo: string;
  initialIsNotified: string;
  error?: string;
}

const IS_NOTIFIED_ALL = "all";

function toDatetimeLocalValue(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export function NotificationsPageClient({
  notifications,
  initialNotifyAtFrom,
  initialNotifyAtTo,
  initialIsNotified,
  error,
}: NotificationsPageClientProps) {
  const router = useRouter();

  const [notifyAtFrom, setNotifyAtFrom] = useState(
    toDatetimeLocalValue(initialNotifyAtFrom),
  );
  const [notifyAtTo, setNotifyAtTo] = useState(
    toDatetimeLocalValue(initialNotifyAtTo),
  );
  const [isNotified, setIsNotified] = useState(
    initialIsNotified === "true" || initialIsNotified === "false"
      ? initialIsNotified
      : IS_NOTIFIED_ALL,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dispatchDialogOpen, setDispatchDialogOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = (ids: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        const set = new Set(prev);
        ids.forEach((id) => set.add(id));
        return Array.from(set);
      }
      const idSet = new Set(ids);
      return prev.filter((id) => !idSet.has(id));
    });
  };

  const handleDispatchConfirm = async () => {
    if (selectedIds.length === 0) return;
    setIsDispatching(true);
    try {
      const result = await dispatchNotifications(selectedIds);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const count = result.notifications?.length ?? 0;
      toast.success(`${count}件の通知を送信しました`);
      setDispatchDialogOpen(false);
      setSelectedIds([]);
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (notifyAtFrom)
      params.set("notifyAtFrom", fromDatetimeLocalValue(notifyAtFrom));
    if (notifyAtTo)
      params.set("notifyAtTo", fromDatetimeLocalValue(notifyAtTo));
    if (isNotified !== IS_NOTIFIED_ALL) params.set("isNotified", isNotified);
    router.push(`/dotto/notifications?${params.toString()}`);
  };

  const handleDeleteOpen = (notification: Notification) => {
    setDeleteTarget(notification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteNotification(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("通知を削除しました");
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout
      actions={
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedIds.length === 0}
            onClick={() => setDispatchDialogOpen(true)}
          >
            <Send className="mr-1 size-4" />
            選択した通知を送信
            {selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}
          </Button>
          <Button asChild size="sm">
            <Link href="/dotto/notifications/new">
              <Plus className="mr-1 size-4" />
              追加
            </Link>
          </Button>
        </>
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
              <Label>通知予定日時（開始）</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="datetime-local"
                  value={notifyAtFrom}
                  onChange={(e) => setNotifyAtFrom(e.target.value)}
                  className="flex-1"
                />
                {notifyAtFrom && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setNotifyAtFrom("")}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </FilterBarField>
            <FilterBarField>
              <Label>通知予定日時（終了）</Label>
              <div className="flex items-center gap-1">
                <Input
                  type="datetime-local"
                  value={notifyAtTo}
                  onChange={(e) => setNotifyAtTo(e.target.value)}
                  className="flex-1"
                />
                {notifyAtTo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setNotifyAtTo("")}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </FilterBarField>
            <FilterBarField>
              <Label>ステータス</Label>
              <Select value={isNotified} onValueChange={setIsNotified}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={IS_NOTIFIED_ALL}>すべて</SelectItem>
                  <SelectItem value="true">通知済み</SelectItem>
                  <SelectItem value="false">未通知</SelectItem>
                </SelectContent>
              </Select>
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />
              検索
            </Button>
          </FilterBarFormLayout>

          {notifications.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              通知がありません
            </div>
          ) : (
            <NotificationTable
              notifications={notifications}
              onDelete={handleDeleteOpen}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
            />
          )}
        </CardContent>
      </Card>

      <NotificationDispatchDialog
        open={dispatchDialogOpen}
        onOpenChange={setDispatchDialogOpen}
        count={selectedIds.length}
        onConfirm={handleDispatchConfirm}
        isSubmitting={isDispatching}
      />

      <NotificationDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        notification={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
