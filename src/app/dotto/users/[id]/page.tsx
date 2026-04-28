export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { fetchUser } from "../actions";
import { fetchFirebaseUser } from "@/app/firebase/users/actions";
import { UserDetailPageClient } from "./UserDetailPageClient";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const [dottoResult, firebaseResult] = await Promise.all([
    fetchUser(id),
    fetchFirebaseUser(id),
  ]);

  if (!dottoResult.user && !firebaseResult.user) {
    notFound();
  }

  return (
    <UserDetailPageClient
      user={dottoResult.user}
      firebaseUser={firebaseResult.user}
      error={dottoResult.error ?? firebaseResult.error}
    />
  );
}
