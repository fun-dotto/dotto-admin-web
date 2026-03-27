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
import type { CourseSemester } from "@/app/dotto/timetable/constants";
import {
  SEMESTER_VALUES,
  SEMESTER_LABEL,
} from "@/app/dotto/timetable/constants";
import { Search } from "lucide-react";

interface TimetableFilterBarProps {
  semester: CourseSemester;
  onSemesterChange: (semester: CourseSemester) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function TimetableFilterBar({
  semester,
  onSemesterChange,
  onSearch,
  isSearching,
}: TimetableFilterBarProps) {
  return (
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
      <Button onClick={onSearch} disabled={isSearching}>
        <Search className="mr-1 size-4" />
        {isSearching ? "検索中..." : "検索"}
      </Button>
    </div>
  );
}
