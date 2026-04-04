"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CourseSemester } from "@/app/dotto/course-registrations/constants";
import {
  SEMESTER_VALUES,
  SEMESTER_LABEL,
} from "@/app/dotto/course-registrations/constants";
import { Search } from "lucide-react";

interface CourseRegistrationFilterBarProps {
  userId: string;
  onUserIdChange: (userId: string) => void;
  semester: CourseSemester;
  onSemesterChange: (semester: CourseSemester) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function CourseRegistrationFilterBar({
  userId,
  onUserIdChange,
  semester,
  onSemesterChange,
  onSearch,
  isSearching,
}: CourseRegistrationFilterBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_auto] md:items-end"
    >
      <div className="flex-1 space-y-2">
        <Label htmlFor="filterUserId">ユーザーID</Label>
        <Input
          id="filterUserId"
          type="text"
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          placeholder="ユーザーIDを入力"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="filterSemester">開講時期</Label>
        <Select
          value={semester}
          onValueChange={(v) => onSemesterChange(v as CourseSemester)}
        >
          <SelectTrigger id="filterSemester" className="w-full md:w-[180px]">
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
      <Button
        type="submit"
        className="w-full md:w-auto"
        disabled={isSearching || !userId.trim()}
      >
        <Search className="mr-1 size-4" />
        {isSearching ? "検索中..." : "検索"}
      </Button>
    </form>
  );
}
