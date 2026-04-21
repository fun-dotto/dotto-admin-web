"use client";

import { ChevronsUpDown, Copy, LogOut } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export function SidebarUserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const displayName = user.displayName || "ユーザー";
  const initial = (user.displayName || user.email || "U").charAt(0).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="size-8 shrink-0 rounded-full"
                />
              ) : (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    {initial}
                  </span>
                </div>
              )}
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(user.uid);
                  toast.success("UIDをコピーしました");
                } catch {
                  toast.error("UIDのコピーに失敗しました");
                }
              }}
            >
              <Copy className="mr-2 size-4" />
              <span>UIDをコピー</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => {
                try {
                  const idToken = await user.getIdToken();
                  await navigator.clipboard.writeText(idToken);
                  toast.success("IDトークンをコピーしました");
                } catch {
                  toast.error("IDトークンのコピーに失敗しました");
                }
              }}
            >
              <Copy className="mr-2 size-4" />
              <span>IDトークンをコピー</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
              <LogOut className="mr-2 size-4" />
              <span>ログアウト</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
