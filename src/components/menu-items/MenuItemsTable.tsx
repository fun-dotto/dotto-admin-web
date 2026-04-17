"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MenuItem } from "@/app/dotto/menu-items/constants";
import { CATEGORY_LABEL, SIZE_LABEL } from "@/app/dotto/menu-items/constants";

interface MenuItemsTableProps {
  menuItems: MenuItem[];
}

export function MenuItemsTable({ menuItems }: MenuItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">画像</TableHead>
          <TableHead>名前</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead>価格</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menuItems.map((menuItem) => (
          <TableRow key={menuItem.id}>
            <TableCell>
              <div className="relative size-14 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={menuItem.imageUrl}
                  alt={menuItem.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </TableCell>
            <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
              {menuItem.name}
            </TableCell>
            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400">
              {CATEGORY_LABEL[menuItem.category]}
            </TableCell>
            <TableCell className="text-sm">
              <div className="flex flex-wrap gap-2">
                {menuItem.prices.map((price) => (
                  <span
                    key={price.size}
                    className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800"
                  >
                    {SIZE_LABEL[price.size]}: ¥{price.price.toLocaleString()}
                  </span>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
