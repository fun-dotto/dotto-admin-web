"use client";

import { AuthenticatedLayout } from "@/components/authenticated-layout";

export default function Home() {
  return (
    <AuthenticatedLayout>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            ダッシュボード
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            左のメニューからページを選択してください
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
