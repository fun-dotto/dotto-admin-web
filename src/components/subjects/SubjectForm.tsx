"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type {
  Subject,
  SubjectRequest,
  SubjectTargetClass,
  SubjectRequirementRequest,
  CourseSemester,
  Grade,
  Class,
  SubjectRequirementType,
} from "@/app/dotto/subjects/constants";
import {
  SEMESTER_LABEL,
  SEMESTER_OPTIONS,
  GRADE_LABEL,
  GRADE_OPTIONS,
  CLASS_LABEL,
  CLASS_OPTIONS,
  REQUIREMENT_TYPE_LABEL,
  REQUIREMENT_TYPE_OPTIONS,
} from "@/app/dotto/subjects/constants";
import type { Course } from "@/app/dotto/courses/constants";
import type { Faculty } from "@/app/dotto/faculties/constants";
import type { SubjectCategory } from "@/app/dotto/subject-categories/constants";
import type { DayOfWeekTimetableSlot } from "@/app/dotto/day-of-week-timetable-slots/constants";
import {
  DAY_OF_WEEK_LABEL,
  TIMETABLE_SLOT_LABEL,
} from "@/app/dotto/day-of-week-timetable-slots/constants";

interface SubjectFormProps {
  subject?: Subject;
  courses: Course[];
  faculties: Faculty[];
  subjectCategories: SubjectCategory[];
  dayOfWeekTimetableSlots: DayOfWeekTimetableSlot[];
  onSubmit: (request: SubjectRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

export function SubjectForm({
  subject,
  courses,
  faculties,
  subjectCategories,
  dayOfWeekTimetableSlots,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: SubjectFormProps) {
  const [name, setName] = useState(subject?.name ?? "");
  const [facultyId, setFacultyId] = useState(subject?.faculty.id ?? "");
  const [semester, setSemester] = useState<CourseSemester | "">(
    subject?.semester ?? "",
  );
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>(
    subject?.dayOfWeekTimetableSlots.map((s) => s.id) ?? [],
  );
  const [eligibleAttributes, setEligibleAttributes] = useState<
    SubjectTargetClass[]
  >(subject?.eligibleAttributes ?? []);
  const [requirements, setRequirements] = useState<
    SubjectRequirementRequest[]
  >(
    subject?.requirements.map((r) => ({
      courseId: r.course.id,
      requirementType: r.requirementType,
    })) ?? [],
  );
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    subject?.categories.map((c) => c.id) ?? [],
  );
  const [syllabusId, setSyllabusId] = useState(subject?.syllabusId ?? "");

  const handleSlotToggle = (slotId: string) => {
    setSelectedSlotIds((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId],
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleAddEligibleAttribute = () => {
    setEligibleAttributes((prev) => [...prev, { grade: "B1" }]);
  };

  const handleRemoveEligibleAttribute = (index: number) => {
    setEligibleAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEligibleAttributeChange = (
    index: number,
    field: "grade" | "class",
    value: string,
  ) => {
    setEligibleAttributes((prev) =>
      prev.map((attr, i) => {
        if (i !== index) return attr;
        if (field === "grade") {
          return { ...attr, grade: value as Grade };
        }
        return {
          ...attr,
          class: value === "" ? undefined : (value as Class),
        };
      }),
    );
  };

  const handleAddRequirement = () => {
    setRequirements((prev) => [
      ...prev,
      { courseId: courses[0]?.id ?? "", requirementType: "Required" },
    ]);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRequirementChange = (
    index: number,
    field: "courseId" | "requirementType",
    value: string,
  ) => {
    setRequirements((prev) =>
      prev.map((req, i) => {
        if (i !== index) return req;
        if (field === "courseId") {
          return { ...req, courseId: value };
        }
        return { ...req, requirementType: value as SubjectRequirementType };
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semester || !facultyId) return;

    const request: SubjectRequest = {
      name,
      facultyId,
      semester,
      dayOfWeekTimetableSlotIds: selectedSlotIds,
      eligibleAttributes,
      requirements,
      categoryIds: selectedCategoryIds,
      syllabusId,
    };

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">科目名</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>教員</Label>
        <Select value={facultyId} onValueChange={setFacultyId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="教員を選択" />
          </SelectTrigger>
          <SelectContent>
            {faculties.map((faculty) => (
              <SelectItem key={faculty.id} value={faculty.id}>
                {faculty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>開講時期</Label>
        <Select
          value={semester}
          onValueChange={(value) => setSemester(value as CourseSemester)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="開講時期を選択" />
          </SelectTrigger>
          <SelectContent>
            {SEMESTER_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {SEMESTER_LABEL[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>曜日・時限</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {dayOfWeekTimetableSlots.map((slot) => (
            <label
              key={slot.id}
              className="flex items-center gap-2 rounded-md border p-2 text-sm"
            >
              <Checkbox
                checked={selectedSlotIds.includes(slot.id)}
                onCheckedChange={() => handleSlotToggle(slot.id)}
              />
              {DAY_OF_WEEK_LABEL[slot.dayOfWeek]}
              {TIMETABLE_SLOT_LABEL[slot.timetableSlot]}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>対象学年・クラス</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEligibleAttribute}
          >
            <Plus className="mr-1 size-4" />
            追加
          </Button>
        </div>
        {eligibleAttributes.map((attr, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={attr.grade}
              onValueChange={(value) =>
                handleEligibleAttributeChange(index, "grade", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="学年" />
              </SelectTrigger>
              <SelectContent>
                {GRADE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {GRADE_LABEL[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={attr.class ?? "__none__"}
              onValueChange={(value) =>
                handleEligibleAttributeChange(
                  index,
                  "class",
                  value === "__none__" ? "" : value,
                )
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="クラス（任意）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">なし</SelectItem>
                {CLASS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {CLASS_LABEL[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveEligibleAttribute(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>必修・選択</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRequirement}
            disabled={courses.length === 0}
          >
            <Plus className="mr-1 size-4" />
            追加
          </Button>
        </div>
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={req.courseId}
              onValueChange={(value) =>
                handleRequirementChange(index, "courseId", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="コース" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={req.requirementType}
              onValueChange={(value) =>
                handleRequirementChange(index, "requirementType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="種別" />
              </SelectTrigger>
              <SelectContent>
                {REQUIREMENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {REQUIREMENT_TYPE_LABEL[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveRequirement(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label>科目群・科目区分</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {subjectCategories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 rounded-md border p-2 text-sm"
            >
              <Checkbox
                checked={selectedCategoryIds.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="syllabusId">シラバスID</Label>
        <Input
          id="syllabusId"
          type="text"
          value={syllabusId}
          onChange={(e) => setSyllabusId(e.target.value)}
          required
        />
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
          disabled={isSubmitting || !semester || !facultyId}
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
