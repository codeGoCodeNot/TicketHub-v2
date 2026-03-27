import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import Spinner from "@/components/spinner";
import InvitationList from "@/features/invitations/components/invitation-list";
import { auth } from "@/lib/auth";
import { organization } from "better-auth/plugins";
import { headers } from "next/headers";
import { Suspense } from "react";

type InvitationPageProps = {
  params: Promise<{ organizationId: string }>;
};

const InvitationPage = async ({ params }: InvitationPageProps) => {
  const { organizationId } = await params;

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
    query: {
      organizationId,
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Invitations"
        description="Manage your organization invitations."
        tabs={
          <OrganizationBreadcrumbs
            organizationName={organization?.name ?? "Organization"}
          />
        }
      />

      <Suspense fallback={<Spinner />}>
        <InvitationList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default InvitationPage;
