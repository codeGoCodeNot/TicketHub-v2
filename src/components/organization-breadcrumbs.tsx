"use client";

import {
  organizationInvitationPagePath,
  organizationMembershipPagePath,
  organizationPagePath,
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
  const isInvitations = pathName.endsWith("invitations");

  const title = {
    memberships: "Memberships",
    invitations: "Invitations",
  }[pathName.split("/").at(-1) as "memberships" | "invitations"];

  return (
    <div className="flex flex-col gap-y-4">
      <BreadCrumbs
        breadcrumbs={[
          { title: "Organizations", href: organizationPagePath() },
          {
            title: organizationName,
          },
        ]}
      />
      <Tabs value={isInvitations ? "invitations" : "memberships"}>
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
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrganizationBreadcrumbs;
