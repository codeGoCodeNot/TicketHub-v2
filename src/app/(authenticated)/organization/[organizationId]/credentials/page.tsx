import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type CrendentialsPageProps = {
  params: Promise<{ organizationId: string }>;
};

const CredentialsPage = async ({ params }: CrendentialsPageProps) => {
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
        title="Credentials"
        description="Manage your organization's API secrets"
        tabs={
          <OrganizationBreadcrumbs
            organizationName={organization?.name ?? "Organization"}
          />
        }
      />
    </div>
  );
};

export default CredentialsPage;
