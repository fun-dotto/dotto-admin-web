import { fetchUsers } from "./actions";
import { UsersPageClient } from "./UsersPageClient";

export default async function UsersPage() {
  const users = await fetchUsers();
  return <UsersPageClient users={users} />;
}
