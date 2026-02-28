"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../constant";
import { cn } from "@/lib/utils";
import useAuth from "@/features/auth/hooks/use-auth";

const SideBar = () => {
  const pathname = usePathname();
  const { user, isFetched } = useAuth();

  if (!user || !isFetched) return null;

  return (
    <Sidebar className="w-50">
      <SidebarContent className="pt-10 px-2 md:pt-20">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      isActive && "bg-muted font-bold hover:bg-muted",
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
