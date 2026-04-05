export const dynamic = "force-dynamic";

import { fetchAnnouncements } from "./actions";
import { AnnouncementsPageClient } from "./AnnouncementsPageClient";

export default async function AnnouncementsPage() {
  const { announcements, error } = await fetchAnnouncements();

  return <AnnouncementsPageClient announcements={announcements} error={error} />;
}
