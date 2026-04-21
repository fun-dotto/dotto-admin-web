"use client";

import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { EnvironmentSwitcher } from "@/components/environment-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navigationSections } from "@/lib/navigation";

const sidebarSections = [
  {
    title: "メニュー",
    items: [
      {
        title: "ホーム",
        href: "/",
        icon: Home,
      },
    ],
  },
  ...navigationSections,
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Link
            href="/"
            aria-label="Dotto Admin"
            className="shrink-0 hover:opacity-80"
          >
            <Image src="/logo.png" alt="Dotto Admin" width={32} height={32} priority />
          </Link>
          <div className="min-w-0 flex-1">
            <EnvironmentSwitcher />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarSections.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
