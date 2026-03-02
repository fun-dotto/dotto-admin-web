import { notFound } from "next/navigation";
import { fetchRoom } from "../../actions";
import { EditRoomPageClient } from "./EditRoomPageClient";

interface EditRoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const { id } = await params;
  const { room } = await fetchRoom(id);

  if (!room) {
    notFound();
  }

  return <EditRoomPageClient room={room} />;
}
