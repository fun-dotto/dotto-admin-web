"use client";

import { useState } from "react";
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
import type { RegistrationRequest } from "@/app/dotto/course-registrations/constants";
import type { SubjectSummary } from "@/app/dotto/subjects/constants";

interface CourseRegistrationFormProps {
  subjects: SubjectSummary[];
  onSubmit: (request: RegistrationRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CourseRegistrationForm({
  subjects,
  onSubmit,
  onCancel,
  isSubmitting,
}: CourseRegistrationFormProps) {
  const [userId, setUserId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !subjectId) return;
    onSubmit({ userId: userId.trim(), subjectId });
  };

  const isValid = userId.trim() && subjectId;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId">ユーザーID</Label>
        <Input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="ユーザーIDを入力"
          required
        />
      </div>

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
