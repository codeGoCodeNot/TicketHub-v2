import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import Spinner from "@/components/spinner";
import { Badge } from "@/components/ui/badge";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import MembershipList from "@/features/membership/components/membership-list";
import getMembership from "@/features/membership/queries/get-membership";
import { forbidden } from "next/navigation";
import { Suspense } from "react";

type MembershipPageProps = {
  params: Promise<{ organizationId: string }>;
};

const MembershipPage = async ({ params }: MembershipPageProps) => {
  const { organizationId } = await params;
  const user = await getAuthOrRedirect();

  const membership = await getMembership({
    organizationId,
    userId: user.id,
  });

  if (!["admin", "owner"].includes(membership?.role || "")) {
    forbidden();
  }

  // Capitalize role for display
  const displayRole =
    membership?.role === "owner"
      ? "Owner"
      : membership?.role === "admin"
        ? "Admin"
        : "Member";

  let badgeVariant: "default" | "secondary" | "outline" = "outline";
  if (membership?.role === "owner") badgeVariant = "default";
  else if (membership?.role === "admin") badgeVariant = "secondary";

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title={
          <span className="flex items-center gap-2">
            Membership <Badge variant={badgeVariant}>{displayRole}</Badge>
          </span>
        }
        description="Manage your organization memberships."
        tabs={<OrganizationBreadcrumbs organizationName="Organization Name" />}
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipPage;
