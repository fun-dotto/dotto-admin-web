"use client";

import { Button } from "@/components/ui/button";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterSemester } from "@/app/dotto/course-registrations/constants";
import {
  COURSE_REGISTRATION_FILTER_SEMESTER_LABEL,
  COURSE_REGISTRATION_FILTER_SEMESTER_VALUES,
} from "@/app/dotto/course-registrations/constants";
import { Search, UserRound } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CourseRegistrationFilterBarProps {
  userId: string;
  onUserIdChange: (userId: string) => void;
  semester: FilterSemester;
  onSemesterChange: (semester: FilterSemester) => void;
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
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <FilterBarFormLayout
      onSubmit={handleSubmit}
      className="md:grid-cols-[minmax(0,1fr)_180px_120px]"
    >
      <FilterBarField className="flex-1">
        <Label htmlFor="filterUserId">ユーザーID</Label>
        <div className="flex gap-1">
          <Input
            id="filterUserId"
            type="text"
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            placeholder="ユーザーIDを入力"
            required
          />
          {user && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onUserIdChange(user.uid)}
              title="自分自身を設定"
            >
              <UserRound className="size-4" />
            </Button>
          )}
        </div>
      </FilterBarField>
      <FilterBarField>
        <Label htmlFor="filterSemester">開講時期</Label>
        <Select
          value={semester}
          onValueChange={(v) => onSemesterChange(v as FilterSemester)}
        >
          <SelectTrigger id="filterSemester" className="w-full md:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COURSE_REGISTRATION_FILTER_SEMESTER_VALUES.map((s) => (
              <SelectItem key={s} value={s}>
                {COURSE_REGISTRATION_FILTER_SEMESTER_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterBarField>
      <Button
        type="submit"
        className="w-full"
        disabled={isSearching || !userId.trim()}
      >
        <Search className="mr-1 size-4" />
        {isSearching ? "検索中..." : "検索"}
      </Button>
    </FilterBarFormLayout>
  );
}
