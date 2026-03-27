"use client";

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
  CourseSemester,
  TimetableSemester,
} from "@/app/dotto/timetable/constants";
import {
  SEMESTER_LABEL,
  TIMETABLE_SEMESTER_LABEL,
  TIMETABLE_SEMESTER_VALUES,
} from "@/app/dotto/timetable/constants";
import { Search } from "lucide-react";

interface TimetableFilterBarProps {
  year: number;
  onYearChange: (year: number) => void;
  timetableSemester: TimetableSemester;
  onTimetableSemesterChange: (semester: TimetableSemester) => void;
  semester: CourseSemester;
  onSemesterChange: (semester: CourseSemester) => void;
  semesterOptions: CourseSemester[];
  onSearch: () => void;
  isSearching: boolean;
}

export function TimetableFilterBar({
  year,
  onYearChange,
  timetableSemester,
  onTimetableSemesterChange,
  semester,
  onSemesterChange,
  semesterOptions,
  onSearch,
  isSearching,
}: TimetableFilterBarProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="flex items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor="year">年度</Label>
        <Select
          value={String(year)}
          onValueChange={(v) => onYearChange(Number(v))}
        >
          <SelectTrigger id="year" className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}年度
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timetableSemester">学期</Label>
        <Select
          value={timetableSemester}
          onValueChange={(v) => onTimetableSemesterChange(v as TimetableSemester)}
        >
          <SelectTrigger id="timetableSemester" className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMETABLE_SEMESTER_VALUES.map((s) => (
              <SelectItem key={s} value={s}>
                {TIMETABLE_SEMESTER_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
            {semesterOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {SEMESTER_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onSearch} disabled={isSearching}>
        <Search className="mr-1 size-4" />
        {isSearching ? "検索中..." : "検索"}
      </Button>
    </div>
  );
}
