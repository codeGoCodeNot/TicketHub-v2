import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import MembershipList from "@/features/membership/components/membership-list";
import { Suspense } from "react";

type MembershipPageProps = {
  params: Promise<{ organizationId: string }>;
};

const MembershipPage = async ({ params }: MembershipPageProps) => {
  const { organizationId } = await params;

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
