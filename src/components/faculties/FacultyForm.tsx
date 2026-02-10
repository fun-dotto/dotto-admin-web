"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Faculty, FacultyRequest } from "@/app/dotto/faculties/constants";

interface FacultyFormProps {
  faculty?: Faculty;
  onSubmit: (request: FacultyRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

export function FacultyForm({
  faculty,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: FacultyFormProps) {
  const [name, setName] = useState(faculty?.name ?? "");
  const [email, setEmail] = useState(faculty?.email ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email });
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
      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
