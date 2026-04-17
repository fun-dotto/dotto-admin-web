export const dynamic = "force-dynamic";

import { fetchMenuItems } from "./actions";
import { MenuItemsPageClient } from "./MenuItemsPageClient";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function todayISODate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface MenuItemsPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function MenuItemsPage({
  searchParams,
}: MenuItemsPageProps) {
  const { date } = await searchParams;
  const targetDate = date && DATE_PATTERN.test(date) ? date : todayISODate();
  const { menuItems, error } = await fetchMenuItems(targetDate);

  return (
    <MenuItemsPageClient
      menuItems={menuItems}
      initialDate={targetDate}
      error={error}
    />
  );
}
