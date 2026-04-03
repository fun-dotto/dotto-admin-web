"use client";

import { useRouter } from "next/navigation";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function NewSubjectPageClient() {
  const router = useRouter();

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dotto/subjects">
                科目管理
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>新規作成</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>科目の新規作成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              現在のAPIでは科目の新規作成はサポートされていません。
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dotto/subjects")}
            >
              科目一覧へ戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
