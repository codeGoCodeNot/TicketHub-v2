import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import MembershipList from "@/features/membership/components/membership-list";
import getMembership from "@/features/membership/queries/get-membership";
import { LucideShield, LucideShieldCheck } from "lucide-react";
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

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title={
          <span className="flex items-center gap-2">
            Membership <LucideShieldCheck className="size-7" />
          </span>
        }
        description="Manage your organization memberships."
      />

      <Suspense fallback={<Spinner />}>
        <MembershipList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default MembershipPage;
