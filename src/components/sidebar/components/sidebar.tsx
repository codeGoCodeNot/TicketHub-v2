"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { pricingPagePath, signInPagePath, signUpPagePath } from "@/path";
import getActivePath from "@/utils/get-active-path";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { navItems } from "../constant";

const MENU_BUTTON_CLASS =
  "h-9 rounded-lg px-3 gap-2.5 text-xs font-normal " +
  "text-sidebar-foreground/70 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground " +
  "data-[active=true]:bg-muted data-[active=true]:text-sidebar-foreground data-[active=true]:font-medium " +
  "data-[active=true]:hover:bg-muted";

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

  const separatorIndex = navItems.findIndex((item) => item.separator);
  const mainItems = navItems.slice(0, separatorIndex);
  const settingsItems = navItems.slice(separatorIndex);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 pt-6 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-[10px] font-bold select-none">
            T
          </div>
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            TicketHub
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 gap-0">
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="h-6 px-2 mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Tickets
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainItems.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={MENU_BUTTON_CLASS}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
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
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="h-6 px-2 mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {settingsItems.map((item, index) => {
                const isActive = activeIndex === separatorIndex + index;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={MENU_BUTTON_CLASS}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 ring-1 ring-sidebar-foreground/10">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md overflow-hidden",
              activeOrganization?.logo
                ? ""
                : "bg-sidebar-foreground/8 text-sidebar-foreground text-sm font-semibold",
            )}
          >
            {activeOrganization?.logo ? (
              <Image
                src={activeOrganization.logo}
                alt={activeOrganization.name ?? "Organization"}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              activeOrganization?.name?.charAt(0).toUpperCase() ?? "?"
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">
              {activeOrganization?.name ?? "No organization"}
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 truncate">
              Active workspace
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
