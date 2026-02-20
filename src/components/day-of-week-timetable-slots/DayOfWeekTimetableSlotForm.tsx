"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  DayOfWeekTimetableSlot,
  DayOfWeekTimetableSlotRequest,
  DayOfWeek,
  TimetableSlot,
} from "@/app/dotto/day-of-week-timetable-slots/constants";
import {
  DAY_OF_WEEK_LABEL,
  DAY_OF_WEEK_OPTIONS,
  TIMETABLE_SLOT_LABEL,
  TIMETABLE_SLOT_OPTIONS,
} from "@/app/dotto/day-of-week-timetable-slots/constants";

interface DayOfWeekTimetableSlotFormProps {
  dayOfWeekTimetableSlot?: DayOfWeekTimetableSlot;
  onSubmit: (request: DayOfWeekTimetableSlotRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

export function DayOfWeekTimetableSlotForm({
  dayOfWeekTimetableSlot,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: DayOfWeekTimetableSlotFormProps) {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | "">(
    dayOfWeekTimetableSlot?.dayOfWeek ?? "",
  );
  const [timetableSlot, setTimetableSlot] = useState<TimetableSlot | "">(
    dayOfWeekTimetableSlot?.timetableSlot ?? "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayOfWeek || !timetableSlot) return;
    onSubmit({ dayOfWeek, timetableSlot });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>曜日</Label>
        <Select
          value={dayOfWeek}
          onValueChange={(value) => setDayOfWeek(value as DayOfWeek)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="曜日を選択" />
          </SelectTrigger>
          <SelectContent>
            {DAY_OF_WEEK_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {DAY_OF_WEEK_LABEL[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>時限</Label>
        <Select
          value={timetableSlot}
          onValueChange={(value) => setTimetableSlot(value as TimetableSlot)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="時限を選択" />
          </SelectTrigger>
          <SelectContent>
            {TIMETABLE_SLOT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {TIMETABLE_SLOT_LABEL[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Button
          type="submit"
          disabled={isSubmitting || !dayOfWeek || !timetableSlot}
        >
          {isSubmitting
            ? "処理中..."
            : isEdit
              ? "更新"
              : "作成"}
        </Button>
      </div>
    </form>
  );
}
