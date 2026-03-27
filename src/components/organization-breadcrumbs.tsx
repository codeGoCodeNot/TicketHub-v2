"use client";

import {
  organizationInvitationPagePath,
  organizationMembershipPagePath,
  organizationPagePath,
} from "@/path";
import { useParams, usePathname } from "next/navigation";
import BreadCrumbs from "./breadcrumbs";

const OrganizationBreadcrumbs = () => {
  const params = useParams<{ organizationId: string }>();
  const pathName = usePathname();

  const title = {
    memberships: "Memberships",
    invitations: "Invitations",
  }[pathName.split("/").at(-1) as "memberships" | "invitations"];

  return (
    <BreadCrumbs
      breadcrumbs={[
        { title: "Organizations", href: organizationPagePath() },
        {
          title,
          dropdown: [
            {
              title: "Memberships",
              href: organizationMembershipPagePath(params.organizationId),
            },
            {
              title: "Invitations",
              href: organizationInvitationPagePath(params.organizationId),
            },
          ],
        },
      ]}
    />
  );
};

export default OrganizationBreadcrumbs;
