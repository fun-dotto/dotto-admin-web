"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const ANDROID_PRIORITY_UNSET = "__unset__";

export function NotificationForm({
  notification,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: NotificationFormProps) {
  const [title, setTitle] = useState(notification?.title ?? "");
  const [body, setBody] = useState(notification?.body ?? "");
  const [url, setUrl] = useState(notification?.url ?? "");
  const [imageUrl, setImageUrl] = useState(notification?.imageUrl ?? "");
  const [analyticsLabel, setAnalyticsLabel] = useState(
    notification?.analyticsLabel ?? "",
  );
  const [apnsBadge, setApnsBadge] = useState(
    notification?.apnsBadge?.toString() ?? "",
  );
  const [apnsSound, setApnsSound] = useState(notification?.apnsSound ?? "");
  const [apnsContentAvailable, setApnsContentAvailable] = useState(
    notification?.apnsContentAvailable ?? false,
  );
  const [androidChannelId, setAndroidChannelId] = useState(
    notification?.androidChannelId ?? "",
  );
  const [androidPriority, setAndroidPriority] = useState(
    notification?.androidPriority ?? ANDROID_PRIORITY_UNSET,
  );
  const [androidTtlSeconds, setAndroidTtlSeconds] = useState(
    notification?.androidTtlSeconds?.toString() ?? "",
  );
  const [webpushLink, setWebpushLink] = useState(
    notification?.webpushLink ?? "",
  );
  const [notifyAfter, setNotifyAfter] = useState(
    notification ? toDatetimeLocal(notification.notifyAfter) : "",
  );
  const [notifyBefore, setNotifyBefore] = useState(
    notification ? toDatetimeLocal(notification.notifyBefore) : "",
  );
  const [targetUserIds, setTargetUserIds] = useState(
    notification?.targetUsers.map((u) => u.userId).join("\n") ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ids = parseTargetUserIds(targetUserIds);
    if (ids.length === 0) {
      setError("対象ユーザーIDを1件以上入力してください");
      return;
    }

    const apnsBadgeNum = apnsBadge === "" ? undefined : Number(apnsBadge);
    if (apnsBadgeNum !== undefined && !Number.isInteger(apnsBadgeNum)) {
      setError("APNsバッジ数は整数で入力してください");
      return;
    }
    const androidTtlNum =
      androidTtlSeconds === "" ? undefined : Number(androidTtlSeconds);
    if (androidTtlNum !== undefined && !Number.isInteger(androidTtlNum)) {
      setError("Android TTLは整数秒で入力してください");
      return;
    }
    setError(null);

    const request: NotificationRequest = {
      title,
      body,
      notifyAfter: fromDatetimeLocal(notifyAfter),
      notifyBefore: fromDatetimeLocal(notifyBefore),
      targetUserIds: ids,
    };

    if (url) request.url = url;
    if (imageUrl) request.imageUrl = imageUrl;
    if (analyticsLabel) request.analyticsLabel = analyticsLabel;
    if (apnsBadgeNum !== undefined) request.apnsBadge = apnsBadgeNum;
    if (apnsSound) request.apnsSound = apnsSound;
    if (apnsContentAvailable) request.apnsContentAvailable = true;
    if (androidChannelId) request.androidChannelId = androidChannelId;
    if (androidPriority !== ANDROID_PRIORITY_UNSET)
      request.androidPriority = androidPriority;
    if (androidTtlNum !== undefined) request.androidTtlSeconds = androidTtlNum;
    if (webpushLink) request.webpushLink = webpushLink;

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
        <Label htmlFor="body">本文</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notifyAfter">通知送信可能日時（開始）</Label>
        <Input
          id="notifyAfter"
          type="datetime-local"
          value={notifyAfter}
          onChange={(e) => setNotifyAfter(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notifyBefore">通知送信期限日時（終了）</Label>
        <Input
          id="notifyBefore"
          type="datetime-local"
          value={notifyBefore}
          onChange={(e) => setNotifyBefore(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">タップ時に開くURL（任意）</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">画像URL（任意）</Label>
        <Input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="analyticsLabel">分析ラベル（任意）</Label>
        <Input
          id="analyticsLabel"
          type="text"
          value={analyticsLabel}
          onChange={(e) => setAnalyticsLabel(e.target.value)}
          placeholder="Firebase Analytics に記録するラベル"
        />
      </div>

      <fieldset className="space-y-4 rounded-md border p-4">
        <legend className="px-1 text-sm font-medium">iOS (APNs)</legend>
        <div className="space-y-2">
          <Label htmlFor="apnsBadge">バッジ数（任意）</Label>
          <Input
            id="apnsBadge"
            type="number"
            min={0}
            step={1}
            value={apnsBadge}
            onChange={(e) => setApnsBadge(e.target.value)}
            placeholder="0 でバッジ消去"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apnsSound">通知音（任意）</Label>
          <Input
            id="apnsSound"
            type="text"
            value={apnsSound}
            onChange={(e) => setApnsSound(e.target.value)}
            placeholder="default / alert.caf など"
          />
        </div>
        <label className="flex items-center gap-2">
          <Checkbox
            checked={apnsContentAvailable}
            onCheckedChange={(checked) =>
              setApnsContentAvailable(checked === true)
            }
          />
          <span className="text-sm">
            content-available（サイレントプッシュ）
          </span>
        </label>
      </fieldset>

      <fieldset className="space-y-4 rounded-md border p-4">
        <legend className="px-1 text-sm font-medium">Android (FCM)</legend>
        <div className="space-y-2">
          <Label htmlFor="androidChannelId">通知チャンネルID（任意）</Label>
          <Input
            id="androidChannelId"
            type="text"
            value={androidChannelId}
            onChange={(e) => setAndroidChannelId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="androidPriority">優先度（任意）</Label>
          <Select value={androidPriority} onValueChange={setAndroidPriority}>
            <SelectTrigger id="androidPriority">
              <SelectValue placeholder="未指定" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANDROID_PRIORITY_UNSET}>未指定</SelectItem>
              <SelectItem value="normal">normal</SelectItem>
              <SelectItem value="high">high</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="androidTtlSeconds">TTL（秒・任意）</Label>
          <Input
            id="androidTtlSeconds"
            type="number"
            min={0}
            step={1}
            value={androidTtlSeconds}
            onChange={(e) => setAndroidTtlSeconds(e.target.value)}
          />
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="webpushLink">Web Push リンク（任意）</Label>
        <Input
          id="webpushLink"
          type="url"
          value={webpushLink}
          onChange={(e) => setWebpushLink(e.target.value)}
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
