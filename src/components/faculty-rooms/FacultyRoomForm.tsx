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
import type { FacultyRoomRequest } from "@/app/dotto/faculty-rooms/constants";
import type { Faculty } from "@/app/dotto/faculties/constants";
import type { Room } from "@/app/dotto/facility-rooms/constants";
import { FLOOR_LABEL } from "@/app/dotto/facility-rooms/constants";

interface FacultyRoomFormProps {
  faculties: Faculty[];
  rooms: Room[];
  onSubmit: (request: FacultyRoomRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FacultyRoomForm({
  faculties,
  rooms,
  onSubmit,
  onCancel,
  isSubmitting,
}: FacultyRoomFormProps) {
  const [facultyId, setFacultyId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId || !roomId) return;
    onSubmit({ facultyId, roomId, year });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="faculty">教員</Label>
        <Select value={facultyId} onValueChange={setFacultyId} required>
          <SelectTrigger id="faculty">
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
        <Label htmlFor="room">教室</Label>
        <Select value={roomId} onValueChange={setRoomId} required>
          <SelectTrigger id="room">
            <SelectValue placeholder="教室を選択" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name} ({FLOOR_LABEL[room.floor]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="year">年度</Label>
        <Input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
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
          disabled={isSubmitting || !facultyId || !roomId}
        >
          {isSubmitting ? "処理中..." : "作成"}
        </Button>
      </div>
    </form>
  );
}
