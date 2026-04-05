export const dynamic = "force-dynamic";

import { fetchUsers } from "./actions";
import { UsersPageClient } from "./UsersPageClient";

export default async function UsersPage() {
  const { users, error } = await fetchUsers();
  return <UsersPageClient users={users} error={error} />;
}
