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
import type { Room, RoomRequest, Floor } from "@/app/dotto/facility-rooms/constants";
import { FLOOR_VALUES, FLOOR_LABEL } from "@/app/dotto/facility-rooms/constants";

interface RoomFormProps {
  room?: Room;
  onSubmit: (request: RoomRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEdit: boolean;
}

export function RoomForm({
  room,
  onSubmit,
  onCancel,
  isSubmitting,
  isEdit,
}: RoomFormProps) {
  const [name, setName] = useState(room?.name ?? "");
  const [floor, setFloor] = useState<Floor | "">(room?.floor ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!floor) return;
    onSubmit({ name, floor });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">教室名</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="floor">フロア</Label>
        <Select
          value={floor}
          onValueChange={(value) => setFloor(value as Floor)}
          required
        >
          <SelectTrigger id="floor">
            <SelectValue placeholder="フロアを選択" />
          </SelectTrigger>
          <SelectContent>
            {FLOOR_VALUES.map((f) => (
              <SelectItem key={f} value={f}>
                {FLOOR_LABEL[f]}
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
        <Button type="submit" disabled={isSubmitting || !floor}>
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
