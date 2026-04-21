"use client";

import { useMemo, useState } from "react";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DottoUserTable } from "@/components/dotto-users/DottoUserTable";
import type { User } from "./constants";
import { ErrorToast } from "@/components/error-toast";

interface UsersPageClientProps {
  users: User[];
  error?: string;
}

export function UsersPageClient({ users, error }: UsersPageClientProps) {
  const [query, setQuery] = useState("");
  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return users;
    }
    return users.filter((user) => {
      return (
        user.id.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [users, query]);

  return (
    <AuthenticatedLayout>
      <ErrorToast error={error} />
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ユーザーID・メールアドレスで絞り込み"
            />
            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                ユーザーが見つかりませんでした
              </div>
            ) : (
              <DottoUserTable users={filteredUsers} />
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
