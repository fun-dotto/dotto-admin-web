export const dynamic = "force-dynamic";

import { fetchPersonalCalendarItems } from "./actions";
import { PersonalCalendarItemsPageClient } from "./PersonalCalendarItemsPageClient";

interface PersonalCalendarItemsPageProps {
  searchParams: Promise<{
    userId?: string;
    date?: string;
  }>;
}

export default async function PersonalCalendarItemsPage({
  searchParams,
}: PersonalCalendarItemsPageProps) {
  const { userId, date } = await searchParams;

  if (!userId || !date) {
    return (
      <PersonalCalendarItemsPageClient
        items={[]}
        initialUserId={userId ?? ""}
        initialDate={date ?? ""}
        hasSearched={false}
      />
    );
  }

  const { items } = await fetchPersonalCalendarItems(userId, [date]);

  return (
    <PersonalCalendarItemsPageClient
      items={items}
      initialUserId={userId}
      initialDate={date}
      hasSearched
    />
  );
}
