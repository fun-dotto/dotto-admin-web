"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { STATUS_FILTER_OPTIONS, StatusFilter } from "@/app/firebase/users/constants";

interface UserFiltersProps {
  searchQuery: string;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function UserFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onClearFilters,
  hasActiveFilters,
}: UserFiltersProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 外部からsearchQueryが変更された場合にローカルステートを同期
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (value: string) => {
    setLocalQuery(value);

    // 既存のタイマーをクリア
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 300ms後にURL更新
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="名前、メール、UIDで検索..."
          value={localQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          ステータス
        </span>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLocalQuery("");
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }
            onClearFilters();
          }}
          className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <X className="mr-1 size-4" />
          フィルタをクリア
        </Button>
      )}
    </div>
  );
}
