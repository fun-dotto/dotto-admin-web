"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterBarField, FilterBarFormLayout } from "@/components/ui/filter-bar-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { SubjectTable } from "@/components/subjects/SubjectTable";
import { SubjectDeleteDialog } from "@/components/subjects/SubjectDeleteDialog";
import { deleteSubject } from "./actions";
import type {
  SubjectSummary,
  Grade,
  Course,
  Class,
  CourseSemester,
  SubjectRequirementType,
  CulturalSubjectCategory,
} from "./constants";
import {
  GRADE_LABEL,
  COURSE_LABEL,
  CLASS_LABEL,
  SEMESTER_LABEL,
  REQUIREMENT_TYPE_LABEL,
  CULTURAL_SUBJECT_CATEGORY_LABEL,
} from "./constants";
import { ErrorToast } from "@/components/error-toast";

const ALL_VALUE = "__all__";

interface SubjectsPageClientProps {
  subjects: SubjectSummary[];
  initialQuery: string;
  initialGrades: Grade[];
  initialCourses: Course[];
  initialClasses: Class[];
  initialSemesters: CourseSemester[];
  initialRequirementTypes: SubjectRequirementType[];
  initialCulturalSubjectCategories: CulturalSubjectCategory[];
  error?: string;
}

export function SubjectsPageClient({
  subjects,
  initialQuery,
  initialGrades,
  initialCourses,
  initialClasses,
  initialSemesters,
  initialRequirementTypes,
  initialCulturalSubjectCategories,
  error,
}: SubjectsPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [grade, setGrade] = useState<Grade | "">(initialGrades[0] ?? "");
  const [course, setCourse] = useState<Course | "">(initialCourses[0] ?? "");
  const [cls, setCls] = useState<Class | "">(initialClasses[0] ?? "");
  const [semester, setSemester] = useState<CourseSemester | "">(initialSemesters[0] ?? "");
  const [requirementType, setRequirementType] = useState<SubjectRequirementType | "">(initialRequirementTypes[0] ?? "");
  const [culturalSubjectCategory, setCulturalSubjectCategory] = useState<CulturalSubjectCategory | "">(initialCulturalSubjectCategories[0] ?? "");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SubjectSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();
    if (trimmedQuery) params.set("q", trimmedQuery);
    if (grade) params.set("grades", grade);
    if (course) params.set("courses", course);
    if (cls) params.set("classes", cls);
    if (semester) params.set("semesters", semester);
    if (requirementType) params.set("requirementTypes", requirementType);
    if (culturalSubjectCategory) params.set("culturalSubjectCategories", culturalSubjectCategory);

    router.push(`/dotto/subjects?${params.toString()}`);
  };

  const handleDeleteOpen = (subject: SubjectSummary) => {
    setDeleteTarget(subject);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const result = await deleteSubject(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("科目を削除しました");
      setDeleteDialogOpen(false);
      router.refresh();
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <ErrorToast error={error} />
      <Card>
        <CardContent className="space-y-4">
          <FilterBarFormLayout
            onSubmit={handleSearch}
            className="md:grid-cols-[minmax(0,1fr)_repeat(6,_140px)_auto]"
          >
            <FilterBarField className="flex-1">
              <Label htmlFor="subjectQuery">科目名</Label>
              <Input
                id="subjectQuery"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="科目名で検索"
              />
            </FilterBarField>
            <FilterBarField>
              <Label htmlFor="filterGrade">学年</Label>
              <Select
                value={grade || ALL_VALUE}
                onValueChange={(v) => setGrade(v === ALL_VALUE ? "" : v as Grade)}
              >
                <SelectTrigger id="filterGrade" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>すべて</SelectItem>
                  {(Object.keys(GRADE_LABEL) as Grade[]).map((g) => (
                    <SelectItem key={g} value={g}>
                      {GRADE_LABEL[g]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBarField>
            <FilterBarField>
              <Label htmlFor="filterCourse">コース</Label>
              <Select
                value={course || ALL_VALUE}
                onValueChange={(v) => setCourse(v === ALL_VALUE ? "" : v as Course)}
              >
                <SelectTrigger id="filterCourse" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>すべて</SelectItem>
                  {(Object.keys(COURSE_LABEL) as Course[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {COURSE_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBarField>
            <FilterBarField>
              <Label htmlFor="filterClass">クラス</Label>
              <Select
                value={cls || ALL_VALUE}
                onValueChange={(v) => setCls(v === ALL_VALUE ? "" : v as Class)}
              >
                <SelectTrigger id="filterClass" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>すべて</SelectItem>
                  {(Object.keys(CLASS_LABEL) as Class[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {CLASS_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBarField>
            <FilterBarField>
              <Label htmlFor="filterSemester">開講時期</Label>
              <Select
                value={semester || ALL_VALUE}
                onValueChange={(v) => setSemester(v === ALL_VALUE ? "" : v as CourseSemester)}
              >
                <SelectTrigger id="filterSemester" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>すべて</SelectItem>
                  {(Object.keys(SEMESTER_LABEL) as CourseSemester[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {SEMESTER_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBarField>
            <FilterBarField>
              <Label htmlFor="filterRequirementType">必修区分</Label>
              <Select
                value={requirementType || ALL_VALUE}
                onValueChange={(v) => setRequirementType(v === ALL_VALUE ? "" : v as SubjectRequirementType)}
              >
                <SelectTrigger id="filterRequirementType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>すべて</SelectItem>
                  {(Object.keys(REQUIREMENT_TYPE_LABEL) as SubjectRequirementType[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {REQUIREMENT_TYPE_LABEL[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBarField>
            <FilterBarField>
              <Label htmlFor="filterCulturalCategory">教養区分</Label>
              <Select
                value={culturalSubjectCategory || ALL_VALUE}
                onValueChange={(v) => setCulturalSubjectCategory(v === ALL_VALUE ? "" : v as CulturalSubjectCategory)}
              >
                <SelectTrigger id="filterCulturalCategory" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>すべて</SelectItem>
                  {(Object.keys(CULTURAL_SUBJECT_CATEGORY_LABEL) as CulturalSubjectCategory[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {CULTURAL_SUBJECT_CATEGORY_LABEL[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBarField>
            <Button type="submit" className="w-full md:w-auto">
              <Search className="mr-1 size-4" />
              検索
            </Button>
          </FilterBarFormLayout>
          {subjects.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
              科目がありません
            </div>
          ) : (
            <SubjectTable subjects={subjects} onDelete={handleDeleteOpen} />
          )}
        </CardContent>
      </Card>

      <SubjectDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        subject={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </AuthenticatedLayout>
  );
}
