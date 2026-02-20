"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  SubjectCategory,
  SubjectCategoryRequest,
} from "@/app/dotto/subject-categories/constants";

interface SubjectCategoryFormProps {
  subjectCategory?: SubjectCategory;
  onSubmit: (request: SubjectCategoryRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

export function SubjectCategoryForm({
  subjectCategory,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: SubjectCategoryFormProps) {
  const [name, setName] = useState(subjectCategory?.name ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">名前</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <Button type="submit" disabled={isSubmitting}>
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
