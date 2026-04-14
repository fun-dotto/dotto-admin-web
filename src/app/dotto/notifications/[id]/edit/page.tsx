import { notFound } from "next/navigation";
import { fetchNotifications } from "../../actions";
import { EditNotificationPageClient } from "./EditNotificationPageClient";

interface EditNotificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNotificationPage({
  params,
}: EditNotificationPageProps) {
  const { id } = await params;
  const { notifications } = await fetchNotifications();
  const notification = notifications.find((item) => item.id === id);

  if (!notification) {
    notFound();
  }

  return <EditNotificationPageClient notification={notification} />;
}
