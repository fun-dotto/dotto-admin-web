"use client";

import { Button } from "@/components/ui/button";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TimetableSemester,
} from "@/app/dotto/timetable/constants";
import {
  TIMETABLE_SEMESTER_LABEL,
  TIMETABLE_SEMESTER_VALUES,
} from "@/app/dotto/timetable/constants";
import {
  ACADEMIC_YEAR_LABEL,
  ACADEMIC_YEAR_VALUES,
  AcademicYear,
} from "@/lib/academic-year";
import { Search } from "lucide-react";

interface TimetableFilterBarProps {
  year: AcademicYear;
  onYearChange: (year: AcademicYear) => void;
  timetableSemester: TimetableSemester;
  onTimetableSemesterChange: (semester: TimetableSemester) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function TimetableFilterBar({
  year,
  onYearChange,
  timetableSemester,
  onTimetableSemesterChange,
  onSearch,
  isSearching,
}: TimetableFilterBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <FilterBarFormLayout
      onSubmit={handleSubmit}
      className="md:grid-cols-[120px_180px_120px]"
    >
      <FilterBarField>
        <Label htmlFor="year">年度</Label>
        <Select
          value={String(year)}
          onValueChange={(v) => onYearChange(Number(v) as AcademicYear)}
        >
          <SelectTrigger id="year" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACADEMIC_YEAR_VALUES.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {ACADEMIC_YEAR_LABEL[y]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBarField>

      <FilterBarField>
        <Label htmlFor="timetableSemester">開講時期</Label>
        <Select
          value={timetableSemester}
          onValueChange={(v) => onTimetableSemesterChange(v as TimetableSemester)}
        >
          <SelectTrigger id="timetableSemester" className="w-full">
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
      </FilterBarField>

      <Button type="submit" disabled={isSearching} className="w-full">
        <Search className="mr-1 size-4" />
        {isSearching ? "検索中..." : "検索"}
      </Button>
    </FilterBarFormLayout>
  );
}
