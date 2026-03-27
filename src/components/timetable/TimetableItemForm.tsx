"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TimetableItemRequest,
  DayOfWeek,
  Period,
} from "@/app/dotto/timetable/constants";
import {
  DAY_OF_WEEK_VALUES,
  DAY_OF_WEEK_LABEL,
  PERIOD_VALUES,
  PERIOD_LABEL,
} from "@/app/dotto/timetable/constants";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";
import type { Room } from "@/app/dotto/facility-rooms/constants";
import { FLOOR_LABEL } from "@/app/dotto/facility-rooms/constants";

interface TimetableItemFormProps {
  subjects: SubjectSummary[];
  rooms: Room[];
  onSubmit: (request: TimetableItemRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TimetableItemForm({
  subjects,
  rooms,
  onSubmit,
  onCancel,
  isSubmitting,
}: TimetableItemFormProps) {
  const [subjectId, setSubjectId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | "">("");
  const [period, setPeriod] = useState<Period | "">("");
  const [roomIds, setRoomIds] = useState<string[]>([]);

  const handleRoomToggle = (roomId: string, checked: boolean) => {
    setRoomIds((prev) =>
      checked
        ? [...prev, roomId]
        : prev.filter((id) => id !== roomId),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !dayOfWeek || !period) return;
    onSubmit({ subjectId, slot: { dayOfWeek, period }, roomIds });
  };

  const isValid = subjectId && dayOfWeek && period;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subjectId">科目</Label>
        <Select value={subjectId} onValueChange={setSubjectId} required>
          <SelectTrigger id="subjectId">
            <SelectValue placeholder="科目を選択" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dayOfWeek">曜日</Label>
        <Select
          value={dayOfWeek}
          onValueChange={(v) => setDayOfWeek(v as DayOfWeek)}
          required
        >
          <SelectTrigger id="dayOfWeek">
            <SelectValue placeholder="曜日を選択" />
          </SelectTrigger>
          <SelectContent>
            {DAY_OF_WEEK_VALUES.map((d) => (
              <SelectItem key={d} value={d}>
                {DAY_OF_WEEK_LABEL[d]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="period">時限</Label>
        <Select
          value={period}
          onValueChange={(v) => setPeriod(v as Period)}
          required
        >
          <SelectTrigger id="period">
            <SelectValue placeholder="時限を選択" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_VALUES.map((p) => (
              <SelectItem key={p} value={p}>
                {PERIOD_LABEL[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>教室（任意・複数選択可）</Label>
        {rooms.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            教室が登録されていません
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {rooms.map((room) => (
              <label key={room.id} className="flex items-center gap-2 rounded border p-2">
                <Checkbox
                  checked={roomIds.includes(room.id)}
                  onCheckedChange={(checked) =>
                    handleRoomToggle(room.id, checked === true)
                  }
                />
                <span className="text-sm">
                  {room.name} ({FLOOR_LABEL[room.floor]})
                </span>
              </label>
            ))}
          </div>
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
        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "処理中..." : "作成"}
        </Button>
      </div>
    </form>
  );
}
