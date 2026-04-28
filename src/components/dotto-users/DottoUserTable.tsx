"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/app/dotto/users/constants";
import {
  CLASS_LABEL,
  COURSE_LABEL,
  GRADE_LABEL,
} from "@/app/dotto/users/constants";

interface DottoUserTableProps {
  users: User[];
}

export function DottoUserTable({ users }: DottoUserTableProps) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>メールアドレス</TableHead>
          <TableHead>学年</TableHead>
          <TableHead>コース</TableHead>
          <TableHead>クラス</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            onClick={() => router.push(`/dotto/users/${user.id}`)}
            className="cursor-pointer"
          >
            <TableCell className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {user.id}
            </TableCell>
            <TableCell className="text-sm">{user.email}</TableCell>
            <TableCell className="text-sm">
              {user.grade ? GRADE_LABEL[user.grade] : "-"}
            </TableCell>
            <TableCell className="text-sm">
              {user.course ? COURSE_LABEL[user.course] : "-"}
            </TableCell>
            <TableCell className="text-sm">
              {user.class ? CLASS_LABEL[user.class] : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
