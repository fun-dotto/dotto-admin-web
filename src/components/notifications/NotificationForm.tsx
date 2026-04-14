"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  Notification,
  NotificationRequest,
} from "@/app/dotto/notifications/constants";

interface NotificationFormProps {
  notification?: Notification;
  onSubmit: (request: NotificationRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

function toDatetimeLocal(isoString: string): string {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocal(datetimeLocal: string): string {
  return new Date(datetimeLocal).toISOString();
}

function parseTargetUserIds(value: string): string[] {
  return value
    .split(/[\s,]+/)
    .map((id) => id.trim())
    .filter(Boolean);
}

export function NotificationForm({
  notification,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: NotificationFormProps) {
  const [title, setTitle] = useState(notification?.title ?? "");
  const [message, setMessage] = useState(notification?.message ?? "");
  const [url, setUrl] = useState(notification?.url ?? "");
  const [notifyAt, setNotifyAt] = useState(
    notification ? toDatetimeLocal(notification.notifyAt) : "",
  );
  const [targetUserIds, setTargetUserIds] = useState(
    notification?.targetUserIds.join("\n") ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ids = parseTargetUserIds(targetUserIds);
    if (ids.length === 0) {
      setError("対象ユーザーIDを1件以上入力してください");
      return;
    }
    setError(null);

    const request: NotificationRequest = {
      title,
      message,
      notifyAt: fromDatetimeLocal(notifyAt),
      targetUserIds: ids,
    };

    if (url) {
      request.url = url;
    }

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">メッセージ</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notifyAt">通知予定日時</Label>
        <Input
          id="notifyAt"
          type="datetime-local"
          value={notifyAt}
          onChange={(e) => setNotifyAt(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL（任意）</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetUserIds">対象ユーザーID</Label>
        <Textarea
          id="targetUserIds"
          value={targetUserIds}
          onChange={(e) => setTargetUserIds(e.target.value)}
          rows={5}
          placeholder="改行またはカンマ区切りで入力"
          required
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "処理中..." : isEdit ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  );
}
