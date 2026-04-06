"use client";
import {
  organizationCredentialsPagePath,
  organizationCredentialUsagePagePath,
  organizationInvitationPagePath,
  organizationMembershipPagePath,
  organizationPagePath,
  organizationSettingsPagePath,
  subscriptionPagePath,
} from "@/path";
import { useParams, usePathname } from "next/navigation";
import BreadCrumbs from "./breadcrumbs";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
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
  const activeTab =
    lastSegment === "invitations"
      ? "invitations"
      : lastSegment === "credentials"
        ? "credentials"
        : lastSegment === "usage"
          ? "usage"
          : lastSegment === "subscription"
            ? "subscription"
            : lastSegment === "settings"
              ? "settings"
              : "memberships";

  return (
    <div className="flex flex-col gap-y-4">
      <BreadCrumbs
        breadcrumbs={[
          { title: "Organizations", href: organizationPagePath() },
          { title: organizationName },
          ...(activeTab !== "memberships"
            ? [
                {
                  title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
                },
              ]
            : []),
        ]}
      />
      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger value="memberships" asChild>
            <Link href={organizationMembershipPagePath(params.organizationId)}>
              Memberships
            </Link>
          </TabsTrigger>
          <TabsTrigger value="invitations" asChild>
            <Link href={organizationInvitationPagePath(params.organizationId)}>
              Invitations
            </Link>
          </TabsTrigger>

          <TabsTrigger value="credentials" asChild>
            <Link href={organizationCredentialsPagePath(params.organizationId)}>
              Credentials
            </Link>
          </TabsTrigger>

          <TabsTrigger value="usage" asChild>
            <Link
              href={organizationCredentialUsagePagePath(params.organizationId)}
            >
              Usage
            </Link>
          </TabsTrigger>

          <TabsTrigger value="subscription" asChild>
            <Link href={subscriptionPagePath(params.organizationId)}>
              Subscription
            </Link>
          </TabsTrigger>

          <TabsTrigger value="settings" asChild>
            <Link href={organizationSettingsPagePath(params.organizationId)}>
              Settings
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrganizationBreadcrumbs;
