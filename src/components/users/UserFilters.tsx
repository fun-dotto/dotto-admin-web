"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
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

  // 外部からsearchQueryが変更された場合にローカルステートを同期
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localQuery.trim());
  };

  return (
    <FilterBarFormLayout
      onSubmit={handleSearch}
      className="md:grid-cols-[minmax(0,1fr)_180px_auto_auto]"
    >
      <FilterBarField className="relative min-w-[200px] max-w-none">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="名前、メール、UIDで検索..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-9"
        />
      </FilterBarField>
      <FilterBarField>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">ステータス</span>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full md:w-[180px]">
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
      </FilterBarField>
      <Button type="submit" className="w-full md:w-auto">
        <Search className="mr-1 size-4" />
        検索
      </Button>
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setLocalQuery("");
            onClearFilters();
          }}
          className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <X className="mr-1 size-4" />
          フィルタをクリア
        </Button>
      )}
    </FilterBarFormLayout>
  );
}
