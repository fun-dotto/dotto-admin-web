"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubjectRequest } from "@/app/dotto/subjects/constants";

interface SubjectFormProps {
  defaultSyllabusId?: string;
  onSubmit: (request: SubjectRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function SubjectForm({
  defaultSyllabusId,
  onSubmit,
  onCancel,
  isSubmitting,
}: SubjectFormProps) {
  const [syllabusId, setSyllabusId] = useState(defaultSyllabusId ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ syllabusId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <Button type="submit" disabled={isSubmitting || !syllabusId}>
          {isSubmitting ? "処理中..." : "作成"}
        </Button>
      </div>
    </form>
  );
}
