"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FilterBarField,
  FilterBarFormLayout,
} from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { MenuItemsTable } from "@/components/menu-items/MenuItemsTable";
import { ErrorToast } from "@/components/error-toast";
import type { MenuItem } from "./constants";

interface MenuItemsPageClientProps {
  menuItems: MenuItem[];
  initialDate: string;
  error?: string;
}

export function MenuItemsPageClient({
  menuItems,
  initialDate,
  error,
}: MenuItemsPageClientProps) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    const params = new URLSearchParams({ date });
    router.push(`/dotto/menu-items?${params.toString()}`);
  };

  return (
    <AuthenticatedLayout>
      <ErrorToast error={error} />
      <Card>
        <CardHeader>
          <CardTitle>メニュー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[200px_auto]"
          >
            <FilterBarField className="w-full md:w-[200px]">
              <Label htmlFor="menuDate">日付</Label>
              <Input
                id="menuDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />
              検索
            </Button>
          </FilterBarFormLayout>
          {menuItems.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              メニューがありません
            </div>
          ) : (
            <MenuItemsTable menuItems={menuItems} />
          )}
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
