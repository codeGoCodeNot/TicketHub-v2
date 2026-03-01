"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useAuth from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { signInPagePath, signUpPagePath } from "@/path";
import getActivePath from "@/utils/get-active-path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../constant";

const SideBar = () => {
  const pathname = usePathname();
  const { user, isFetched } = useAuth();

  const { activeIndex } = getActivePath(
    pathname,
    navItems.map((item) => item.href),
    [signInPagePath(), signUpPagePath()],
  );

  if (!user || !isFetched) return null;

  return (
    <Sidebar>
      <SidebarContent className="pt-8 px-2 md:pt-20">
        <SidebarMenu>
          {navItems.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <SidebarMenuItem key={item.title}>
                {item.separator && <Separator />}
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
