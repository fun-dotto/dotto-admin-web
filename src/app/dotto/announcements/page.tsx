import { fetchAnnouncements } from "./actions";
import { AnnouncementsPageClient } from "./AnnouncementsPageClient";

export default async function AnnouncementsPage() {
  const { announcements } = await fetchAnnouncements();

  return <AnnouncementsPageClient announcements={announcements} />;
}
