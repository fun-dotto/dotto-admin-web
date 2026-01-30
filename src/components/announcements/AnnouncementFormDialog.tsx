"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  Announcement,
  AnnouncementRequest,
} from "@/app/dotto/announcements/constants";
import { X } from "lucide-react";

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement;
  onSubmit: (request: AnnouncementRequest) => void;
  isSubmitting: boolean;
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

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
  onSubmit,
  isSubmitting,
}: AnnouncementFormDialogProps) {
  const isEdit = !!announcement;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "おしらせを編集" : "おしらせを作成"}
          </DialogTitle>
        </DialogHeader>
        {open && (
          <AnnouncementForm
            key={announcement?.id ?? "new"}
            announcement={announcement}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            isEdit={isEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSubmit: (request: AnnouncementRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

function AnnouncementForm({
  announcement,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: AnnouncementFormProps) {
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [availableFrom, setAvailableFrom] = useState(
    announcement ? toDatetimeLocal(announcement.availableFrom) : ""
  );
  const [availableUntil, setAvailableUntil] = useState(
    announcement?.availableUntil
      ? toDatetimeLocal(announcement.availableUntil)
      : ""
  );
  const [url, setUrl] = useState(announcement?.url ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: AnnouncementRequest = {
      title,
      availableFrom: fromDatetimeLocal(availableFrom),
      url,
    };

    if (availableUntil) {
      request.availableUntil = fromDatetimeLocal(availableUntil);
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
        <Label htmlFor="availableFrom">公開開始日時</Label>
        <Input
          id="availableFrom"
          type="datetime-local"
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="availableUntil">公開終了日時（任意）</Label>
        <div className="flex gap-2">
          <Input
            id="availableUntil"
            type="datetime-local"
            value={availableUntil}
            onChange={(e) => setAvailableUntil(e.target.value)}
            className="flex-1"
          />
          {availableUntil && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setAvailableUntil("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://"
          required
        />
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "処理中..."
            : isEdit
              ? "更新"
              : "作成"}
        </Button>
      </DialogFooter>
    </form>
  );
}
