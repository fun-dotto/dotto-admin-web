"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import type { TimetableItem, DayOfWeek, Period } from "@/app/dotto/timetable/constants";
import {
  DAY_OF_WEEK_LABEL,
  PERIOD_LABEL,
  PERIOD_VALUES,
} from "@/app/dotto/timetable/constants";

const GRID_DAY_OF_WEEK_VALUES: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface TimetableGridViewProps {
  items: TimetableItem[];
  subjectMap: Record<string, string>;
  onDelete: (item: TimetableItem) => void;
}

export function TimetableGridView({
  items,
  subjectMap,
  onDelete,
}: TimetableGridViewProps) {
  const getItemsForSlot = (day: DayOfWeek, period: Period): TimetableItem[] => {
    return items.filter(
      (item) =>
        item.slot?.dayOfWeek === day && item.slot?.period === period,
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 text-center">時限</TableHead>
          {GRID_DAY_OF_WEEK_VALUES.map((day) => (
            <TableHead key={day} className="text-center">
              {DAY_OF_WEEK_LABEL[day]}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {PERIOD_VALUES.map((period) => (
          <TableRow key={period}>
            <TableCell className="text-center font-medium text-zinc-900 dark:text-zinc-50">
              {PERIOD_LABEL[period]}
            </TableCell>
            {GRID_DAY_OF_WEEK_VALUES.map((day) => {
              const slotItems = getItemsForSlot(day, period);
              return (
                <TableCell key={day} className="align-top">
                  {slotItems.length === 0 ? (
                    <span className="text-sm text-zinc-400 dark:text-zinc-600">
                      -
                    </span>
                  ) : (
                    <div className="space-y-1">
                      {slotItems.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-start justify-between gap-1 rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-800"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {subjectMap[item.subject.id] ?? item.subject.id}
                            </div>
                            {item.rooms.length > 0 && (
                              <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                                {item.rooms.map((r) => r.name).join(", ")}
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="shrink-0 opacity-0 group-hover:opacity-100"
                              >
                                <MoreHorizontal className="size-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onDelete(item)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="mr-2 size-4" />
                                削除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
