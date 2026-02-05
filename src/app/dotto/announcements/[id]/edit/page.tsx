import { notFound } from "next/navigation";
import { fetchAnnouncement } from "../../actions";
import { EditAnnouncementPageClient } from "./EditAnnouncementPageClient";

interface EditAnnouncementPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({
  params,
}: EditAnnouncementPageProps) {
  const { id } = await params;
  const { announcement } = await fetchAnnouncement(id);

  if (!announcement) {
    notFound();
  }

  return <EditAnnouncementPageClient announcement={announcement} />;
}
