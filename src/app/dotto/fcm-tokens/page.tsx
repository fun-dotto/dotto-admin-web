export const dynamic = "force-dynamic";

import { fetchFCMTokens } from "./actions";
import { FCMTokensPageClient } from "./FCMTokensPageClient";

interface FCMTokensPageProps {
  searchParams: Promise<{
    userIds?: string;
    tokens?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
  }>;
}

export default async function FCMTokensPage({ searchParams }: FCMTokensPageProps) {
  const { userIds, tokens, updatedAtFrom, updatedAtTo } = await searchParams;
  const parsedUserIds = (userIds ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  const parsedTokens = (tokens ?? "").split(",").map((v) => v.trim()).filter(Boolean);

  const { fcmTokens } = await fetchFCMTokens({
    ...(parsedUserIds.length > 0 ? { userIds: parsedUserIds } : {}),
    ...(parsedTokens.length > 0 ? { tokens: parsedTokens } : {}),
    ...(updatedAtFrom ? { updatedAtFrom } : {}),
    ...(updatedAtTo ? { updatedAtTo } : {}),
  });

  return (
    <FCMTokensPageClient
      fcmTokens={fcmTokens}
      initialUserIds={userIds ?? ""}
      initialTokens={tokens ?? ""}
      initialUpdatedAtFrom={updatedAtFrom ?? ""}
      initialUpdatedAtTo={updatedAtTo ?? ""}
    />
  );
}
