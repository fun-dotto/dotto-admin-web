"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { UserDetailCard } from "@/components/dotto-users/UserDetailCard";
import { fetchUser } from "./actions";
import type { User } from "./constants";

export function UsersPageClient() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const result = await fetchUser(userId.trim());
      if (result.error) {
        toast.error(result.error);
        setUser(null);
        return;
      }
      setUser(result.user ?? null);
    } catch {
      toast.error("エラーが発生しました");
      setUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>ユーザー検索</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="userId">ユーザーID</Label>
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="ユーザーIDを入力"
                  required
                />
              </div>
              <Button type="submit" disabled={isSearching || !userId.trim()}>
                <Search className="mr-1 size-4" />
                {isSearching ? "検索中..." : "検索"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && !isSearching && (
          user ? (
            <UserDetailCard user={user} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                ユーザーが見つかりませんでした
              </CardContent>
            </Card>
          )
        )}
      </div>
    </AuthenticatedLayout>
  );
}
