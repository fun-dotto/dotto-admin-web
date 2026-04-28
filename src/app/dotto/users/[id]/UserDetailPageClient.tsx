"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ErrorToast } from "@/components/error-toast";
import {
  CLASS_LABEL,
  COURSE_LABEL,
  GRADE_LABEL,
} from "@/app/dotto/users/constants";
import type {
  Class,
  Course,
  Grade,
  User,
} from "@/app/dotto/users/constants";
import { upsertUser } from "@/app/dotto/users/actions";
import type { FirebaseUser } from "@/app/firebase/users/actions";

interface UserDetailPageClientProps {
  user?: User;
  firebaseUser?: FirebaseUser;
  error?: string;
}

const UNSET = "__unset__";

const GRADE_OPTIONS = Object.keys(GRADE_LABEL) as Grade[];
const COURSE_OPTIONS = Object.keys(COURSE_LABEL) as Course[];
const CLASS_OPTIONS = Object.keys(CLASS_LABEL) as Class[];

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UserDetailPageClient({
  user,
  firebaseUser,
  error,
}: UserDetailPageClientProps) {
  const router = useRouter();
  const userId = user?.id ?? firebaseUser?.uid ?? "";

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(user?.email ?? firebaseUser?.email ?? "");
  const [grade, setGrade] = useState<string>(user?.grade ?? UNSET);
  const [course, setCourse] = useState<string>(user?.course ?? UNSET);
  const [klass, setKlass] = useState<string>(user?.class ?? UNSET);

  const handleStartEdit = () => {
    setEmail(user?.email ?? firebaseUser?.email ?? "");
    setGrade(user?.grade ?? UNSET);
    setCourse(user?.course ?? UNSET);
    setKlass(user?.class ?? UNSET);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!email) {
      toast.error("メールアドレスを入力してください");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await upsertUser(userId, {
        email,
        grade: grade === UNSET ? undefined : (grade as Grade),
        course: course === UNSET ? undefined : (course as Course),
        class: klass === UNSET ? undefined : (klass as Class),
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("ユーザーを更新しました");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const headerName =
    firebaseUser?.displayName || firebaseUser?.email || user?.email;
  const headerEmail = firebaseUser?.email ?? user?.email;
  const headerPhotoURL = firebaseUser?.photoURL;
  const initial = headerName?.[0] ?? "?";

  const headerContent = (
    <div className="flex items-center gap-3">
      {headerPhotoURL ? (
        <Image
          src={headerPhotoURL}
          alt={headerName || "User"}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {initial}
        </div>
      )}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {headerName ?? "-"}
        </span>
        {headerEmail && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {headerEmail}
          </span>
        )}
      </div>
    </div>
  );

  const headerActions = !isEditing && (
    <Button size="sm" variant="outline" onClick={handleStartEdit}>
      <Pencil className="mr-1 size-4" />
      編集
    </Button>
  );

  return (
    <AuthenticatedLayout
      headerContent={headerContent}
      actions={headerActions}
    >
      <ErrorToast error={error} />
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dotto/users">ユーザー</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>詳細</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>ID</Label>
                  <div className="font-mono text-sm text-zinc-900 dark:text-zinc-50">
                    {userId}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">学年</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger id="grade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNSET}>未設定</SelectItem>
                      {GRADE_OPTIONS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {GRADE_LABEL[g]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">コース</Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger id="course">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNSET}>未設定</SelectItem>
                      {COURSE_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {COURSE_LABEL[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">クラス</Label>
                  <Select value={klass} onValueChange={setKlass}>
                    <SelectTrigger id="class">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNSET}>未設定</SelectItem>
                      {CLASS_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CLASS_LABEL[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "処理中..." : "保存"}
                  </Button>
                </div>
              </form>
            ) : (
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
                {userId && (
                  <>
                    <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      ID
                    </dt>
                    <dd className="font-mono text-sm text-zinc-900 dark:text-zinc-50">
                      {userId}
                    </dd>
                  </>
                )}

                {headerEmail && (
                  <>
                    <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      メールアドレス
                    </dt>
                    <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                      {headerEmail}
                    </dd>
                  </>
                )}

                {user && (
                  <>
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
                  </>
                )}

                {firebaseUser && (
                  <>
                    <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      ロール
                    </dt>
                    <dd className="flex flex-wrap gap-1">
                      {firebaseUser.isAdmin && (
                        <Badge variant="default">管理者</Badge>
                      )}
                      {firebaseUser.isDeveloper && (
                        <Badge variant="outline">開発者</Badge>
                      )}
                      {!firebaseUser.isAdmin && !firebaseUser.isDeveloper && (
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          -
                        </span>
                      )}
                    </dd>

                    <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      ステータス
                    </dt>
                    <dd className="flex flex-wrap gap-1">
                      {firebaseUser.disabled ? (
                        <Badge variant="destructive">無効</Badge>
                      ) : (
                        <Badge variant="secondary">有効</Badge>
                      )}
                      {firebaseUser.emailVerified && (
                        <Badge variant="outline">メール認証済</Badge>
                      )}
                    </dd>

                    <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      作成日時
                    </dt>
                    <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                      {formatDate(firebaseUser.creationTime)}
                    </dd>

                    <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      最終ログイン
                    </dt>
                    <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                      {formatDate(firebaseUser.lastSignInTime)}
                    </dd>
                  </>
                )}
              </dl>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
