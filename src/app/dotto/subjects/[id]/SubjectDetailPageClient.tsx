"use client";

import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  CLASS_LABEL,
  COURSE_LABEL,
  GRADE_LABEL,
  REQUIREMENT_TYPE_LABEL,
  SEMESTER_LABEL,
} from "../constants";
import type {
  Subject,
  SubjectRequirement,
  SubjectTargetClass,
} from "../constants";

interface SubjectDetailPageClientProps {
  subject: Subject;
}

function formatTargetClass(targetClass: SubjectTargetClass): string {
  const gradeLabel = GRADE_LABEL[targetClass.grade];
  if (!targetClass.class) {
    return gradeLabel;
  }
  return `${gradeLabel}-${CLASS_LABEL[targetClass.class]}`;
}

function formatRequirement(requirement: SubjectRequirement): string {
  return `${COURSE_LABEL[requirement.course]} (${REQUIREMENT_TYPE_LABEL[requirement.requirementType]})`;
}

export function SubjectDetailPageClient({
  subject,
}: SubjectDetailPageClientProps) {
  const eligibleAttributes = subject.eligibleAttributes ?? [];
  const requirements = subject.requirements ?? [];
  const faculties = subject.faculties
    .map((f) => (f.isPrimary ? `${f.faculty.name} (主担当)` : f.faculty.name))
    .join(", ");

  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dotto/subjects">科目管理</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>科目詳細</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>{subject.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                ID
              </dt>
              <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                {subject.id}
              </dd>

              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                開講年度
              </dt>
              <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                {subject.year}
              </dd>

              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                開講時期
              </dt>
              <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                {SEMESTER_LABEL[subject.semester]}
              </dd>

              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                単位
              </dt>
              <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                {subject.credit}
              </dd>

              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                教員
              </dt>
              <dd className="text-sm text-zinc-900 dark:text-zinc-50">
                {faculties || "-"}
              </dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>対象クラス</CardTitle>
          </CardHeader>
          <CardContent>
            {eligibleAttributes.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">-
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {eligibleAttributes.map((targetClass, index) => (
                  <Badge variant="outline" key={`${targetClass.grade}-${targetClass.class ?? "none"}-${index}`}>
                    {formatTargetClass(targetClass)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>科目要件</CardTitle>
          </CardHeader>
          <CardContent>
            {requirements.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">-
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {requirements.map((requirement, index) => (
                  <Badge
                    variant="secondary"
                    key={`${requirement.course}-${requirement.requirementType}-${index}`}
                  >
                    {formatRequirement(requirement)}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
