"use client";
import {
  organizationCredentialsPagePath,
  organizationCredentialUsagePagePath,
  organizationInvitationPagePath,
  organizationMembershipPagePath,
  organizationPagePath,
  organizationSettingsPagePath,
  subscriptionPagePath,
  organizationActivityLogPagePath,
} from "@/path";
import { useParams, usePathname } from "next/navigation";
import BreadCrumbs from "./breadcrumbs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import Link from "next/link";

type OrganizationBreadcrumbsProps = {
  organizationName: string;
};

const OrganizationBreadcrumbs = ({
  organizationName,
}: OrganizationBreadcrumbsProps) => {
  const params = useParams<{ organizationId: string }>();
  const pathName = usePathname();

  const lastSegment = pathName.split("/").at(-1);
  // Default to memberships if not matching any known section
  const validTabs = [
    "memberships",
    "invitations",
    "credentials",
    "usage",
    "subscription",
    "activity-log",
    "settings",
  ];
  const activeTab = validTabs.includes(lastSegment || "")
    ? lastSegment
    : "memberships";

  const menuItems = [
    {
      value: "memberships",
      label: "Memberships",
      href: organizationMembershipPagePath(params.organizationId),
    },
    {
      value: "invitations",
      label: "Invitations",
      href: organizationInvitationPagePath(params.organizationId),
    },
    {
      value: "credentials",
      label: "Credentials",
      href: organizationCredentialsPagePath(params.organizationId),
    },
    {
      value: "usage",
      label: "Usage",
      href: organizationCredentialUsagePagePath(params.organizationId),
    },
    {
      value: "subscription",
      label: "Subscription",
      href: subscriptionPagePath(params.organizationId),
    },
    {
      value: "settings",
      label: "Settings",
      href: organizationSettingsPagePath(params.organizationId),
    },
    {
      value: "activity-log",
      label: "Activity Log",
      href: organizationActivityLogPagePath(params.organizationId),
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <BreadCrumbs
        breadcrumbs={[
          { title: "Organizations", href: organizationPagePath() },
          { title: organizationName },
          {
            title: activeTab
              ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
              : "",
          },
        ]}
      />
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="px-3 py-2 border rounded bg-muted text-foreground flex items-center gap-2">
            {menuItems.find((item) => item.value === activeTab)?.label ||
              "Navigate"}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {menuItems.map((item) => (
              <DropdownMenuItem asChild key={item.value}>
                <Link
                  href={item.href}
                  className={
                    item.value === activeTab ? "font-semibold bg-accent" : ""
                  }
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default OrganizationBreadcrumbs;
