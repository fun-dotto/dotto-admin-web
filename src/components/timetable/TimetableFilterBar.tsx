"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CourseSemester,
  DayOfWeek,
} from "@/app/dotto/timetable/constants";
import {
  SEMESTER_VALUES,
  SEMESTER_LABEL,
  DAY_OF_WEEK_VALUES,
  DAY_OF_WEEK_LABEL,
} from "@/app/dotto/timetable/constants";
import { Search } from "lucide-react";

interface TimetableFilterBarProps {
  semester: CourseSemester;
  onSemesterChange: (semester: CourseSemester) => void;
  selectedDays: DayOfWeek[];
  onSelectedDaysChange: (days: DayOfWeek[]) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function TimetableFilterBar({
  semester,
  onSemesterChange,
  selectedDays,
  onSelectedDaysChange,
  onSearch,
  isSearching,
}: TimetableFilterBarProps) {
  const handleDayToggle = (day: DayOfWeek, checked: boolean) => {
    if (checked) {
      onSelectedDaysChange([...selectedDays, day]);
    } else {
      onSelectedDaysChange(selectedDays.filter((d) => d !== day));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="semester">開講時期</Label>
          <Select
            value={semester}
            onValueChange={(v) => onSemesterChange(v as CourseSemester)}
          >
            <SelectTrigger id="semester" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEMESTER_VALUES.map((s) => (
                <SelectItem key={s} value={s}>
                  {SEMESTER_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onSearch} disabled={isSearching || selectedDays.length === 0}>
          <Search className="mr-1 size-4" />
          {isSearching ? "検索中..." : "検索"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label>曜日</Label>
        <div className="flex gap-4">
          {DAY_OF_WEEK_VALUES.map((day) => (
            <label key={day} className="flex items-center gap-1.5">
              <Checkbox
                checked={selectedDays.includes(day)}
                onCheckedChange={(checked) =>
                  handleDayToggle(day, checked === true)
                }
              />
              <span className="text-sm">{DAY_OF_WEEK_LABEL[day]}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
