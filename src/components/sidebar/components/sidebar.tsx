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
      <SidebarContent className="px-2.5 pt-8 md:pt-20">
        <div className="mb-2 rounded-lg border border-sidebar-border/70 px-3 py-2.5">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-sidebar-foreground/60 uppercase">
            Navigation
          </p>
          <p className="mt-0.5 text-sm font-semibold text-sidebar-foreground/90">
            TicketHub
          </p>
        </div>

        <SidebarMenu className="gap-1.5">
          {navItems.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <SidebarMenuItem key={item.title}>
                {item.separator && <Separator className="my-2" />}
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="h-10 rounded-lg px-2.5 transition-colors hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground active:bg-sidebar-foreground/5 active:text-sidebar-foreground data-[active=true]:bg-muted data-[active=true]:text-sidebar-foreground data-[active=true]:font-semibold data-[active=true]:hover:bg-muted data-[active=true]:active:bg-muted"
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="flex items-center gap-3"
                  >
                    <span className="shrink-0 [&>svg]:size-4 [&>svg]:shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.title}</span>
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
