"use client";

import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { CircularProgress } from "@/components/ui/circular-progress";

export default function Loading() {
  return (
    <AuthenticatedLayout>
      <div className="flex min-h-[50vh] items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    </AuthenticatedLayout>
  );
}
