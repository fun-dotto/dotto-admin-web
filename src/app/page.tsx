"use client";

import { AuthenticatedLayout } from "@/components/authenticated-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { navigationSections } from "@/lib/navigation";
import Link from "next/link";

export default function Home() {
  return (
    <AuthenticatedLayout>
      <iframe
        width="100%"
        height="400"
        src="https://datastudio.google.com/embed/reporting/638767f2-6a09-4a33-9e0a-7dee4acd6184/page/kb3fF"
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
      <div className="flex flex-1 flex-col gap-8 p-6">
        {navigationSections.map((section) => (
          <div key={section.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {section.title}
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
              {section.items.map((card) => (
                <Link key={card.href} href={card.href}>
                  <Card className="py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">
                    <CardHeader className="flex flex-row items-center gap-3 px-4">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                        <card.icon className="size-4 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm">{card.title}</CardTitle>
                        {card.description && (
                          <CardDescription className="text-xs">
                            {card.description}
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
