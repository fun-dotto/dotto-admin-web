export const dynamic = "force-dynamic";

import { fetchPersonalCalendarItems } from "./actions";
import { PersonalCalendarItemsPageClient } from "./PersonalCalendarItemsPageClient";

interface PersonalCalendarItemsPageProps {
  searchParams: Promise<{
    userId?: string;
    dates?: string;
  }>;
}

export default async function PersonalCalendarItemsPage({
  searchParams,
}: PersonalCalendarItemsPageProps) {
  const { userId, dates: datesParam } = await searchParams;
  const dates = datesParam ? datesParam.split(",").filter(Boolean) : [];

  if (!userId || dates.length === 0) {
    return (
      <PersonalCalendarItemsPageClient
        items={[]}
        initialUserId={userId ?? ""}
        initialDates={dates}
        hasSearched={false}
      />
    );
  }

  const { items, error } = await fetchPersonalCalendarItems(userId, dates);

  return (
    <PersonalCalendarItemsPageClient
      items={items}
      initialUserId={userId}
      initialDates={dates}
      hasSearched
      error={error}
    />
  );
}
