"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/app/dotto/users/constants";
import {
  GRADE_LABEL,
  COURSE_LABEL,
  CLASS_LABEL,
} from "@/app/dotto/users/constants";

interface UserDetailCardProps {
  user: User;
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ユーザー詳細</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            ID
          </dt>
          <dd className="text-sm text-zinc-900 dark:text-zinc-50">
            {user.id}
          </dd>

          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            メールアドレス
          </dt>
          <dd className="text-sm text-zinc-900 dark:text-zinc-50">
            {user.email}
          </dd>

          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            学年
          </dt>
          <dd className="text-sm text-zinc-900 dark:text-zinc-50">
            {user.grade ? GRADE_LABEL[user.grade] : "未設定"}
          </dd>

          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            コース
          </dt>
          <dd className="text-sm text-zinc-900 dark:text-zinc-50">
            {user.course ? COURSE_LABEL[user.course] : "未設定"}
          </dd>

          <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            クラス
          </dt>
          <dd className="text-sm text-zinc-900 dark:text-zinc-50">
            {user.class ? CLASS_LABEL[user.class] : "未設定"}
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
}
