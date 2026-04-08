"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { pricingPagePath, signInPagePath, signUpPagePath } from "@/path";
import getActivePath from "@/utils/get-active-path";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { navItems } from "../constant";

const SideBar = () => {
  const pathname = usePathname();

  const { data: activeOrganization, refetch } =
    authClient.useActiveOrganization();

  useEffect(() => {
    refetch();
  }, [pathname]);

  const { activeIndex } = getActivePath(
    pathname,
    navItems.map((item) => item.href),
    [signInPagePath(), signUpPagePath(), pricingPagePath()],
  );

  return (
    <Sidebar>
      <SidebarContent className="px-2.5 pt-8 md:pt-20">
        <div className="mb-2 rounded-lg border border-sidebar-border/90 px-3 py-2.5">
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
      <SidebarFooter className="p-3">
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border/90 px-3 py-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            {activeOrganization?.logo ? (
              <Image
                src={activeOrganization.logo}
                alt={activeOrganization.name ?? "Organization"}
                width={28}
                height={28}
                className="object-cover w-full h-full"
              />
            ) : (
              (activeOrganization?.name?.charAt(0).toUpperCase() ?? "?")
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">
              {activeOrganization?.name ?? "No organization"}
            </p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">
              Active workspace
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
