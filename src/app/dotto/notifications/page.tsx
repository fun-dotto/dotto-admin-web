export const dynamic = "force-dynamic";

import { fetchNotifications } from "./actions";
import { NotificationsPageClient } from "./NotificationsPageClient";

interface NotificationsPageProps {
  searchParams: Promise<{
    notifyAtFrom?: string;
    notifyAtTo?: string;
    isNotified?: string;
  }>;
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const { notifyAtFrom, notifyAtTo, isNotified } = await searchParams;

  const isNotifiedFilter =
    isNotified === "true" ? true : isNotified === "false" ? false : undefined;

  const { notifications, error } = await fetchNotifications({
    ...(notifyAtFrom ? { notifyAtFrom } : {}),
    ...(notifyAtTo ? { notifyAtTo } : {}),
    ...(isNotifiedFilter !== undefined ? { isNotified: isNotifiedFilter } : {}),
  });

  return (
    <NotificationsPageClient
      notifications={notifications}
      initialNotifyAtFrom={notifyAtFrom ?? ""}
      initialNotifyAtTo={notifyAtTo ?? ""}
      initialIsNotified={isNotified ?? ""}
      error={error}
    />
  );
}
