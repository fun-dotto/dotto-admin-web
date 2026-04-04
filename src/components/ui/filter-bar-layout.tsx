import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

const filterBarLayoutClassName =
  "grid gap-4 md:grid-cols-[minmax(0,1fr)_180px_auto] md:items-end";

type FilterBarLayoutProps = ComponentPropsWithoutRef<"div">;

export function FilterBarLayout({
  className,
  children,
  ...props
}: FilterBarLayoutProps) {
  return (
    <div className={cn(filterBarLayoutClassName, className)} {...props}>
      {children}
    </div>
  );
}

type FilterBarFormLayoutProps = ComponentPropsWithoutRef<"form">;

export function FilterBarFormLayout({
  className,
  children,
  ...props
}: FilterBarFormLayoutProps) {
  return (
    <form className={cn(filterBarLayoutClassName, className)} {...props}>
      {children}
    </form>
  );
}

type FilterBarFieldProps = ComponentPropsWithoutRef<"div">;

export function FilterBarField({
  className,
  children,
  ...props
}: FilterBarFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  );
}
