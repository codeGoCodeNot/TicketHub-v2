import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import Spinner from "@/components/spinner";
import CredentialUsageList from "@/features/credential-usage/components/credential-usage-list";
import CredentialCreateButton from "@/features/credential/components/credential-create-button";
import CredentialList from "@/features/credential/components/credential-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

type UsagePageProps = {
  params: Promise<{ organizationId: string }>;
};

const UsagePage = async ({ params }: UsagePageProps) => {
  const { organizationId } = await params;

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
    query: {
      organizationId,
    },
  });

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <Heading
        title="Credentials Usage"
        description="View the usage history of your organization's API secrets"
        tabs={
          <OrganizationBreadcrumbs
            organizationName={organization?.name ?? "Organization"}
          />
        }
        actions={<CredentialCreateButton organizationId={organizationId} />}
      />

      <Suspense fallback={<Spinner />}>
        <CredentialUsageList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default UsagePage;
