import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import MembershipList from "@/features/membership/components/membership-list";
import getMembership from "@/features/membership/queries/get-membership";
import { ticketsPagePath } from "@/path";
import { redirect } from "next/navigation";
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
    redirect(ticketsPagePath());
  }

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Membership"
        description="Manage your organization memberships."
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipPage;
