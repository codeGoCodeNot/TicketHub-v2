import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import UpdateOrganizationForm from "@/features/organization-settings/components/update-organization-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type OrganizationSettingsPageProps = {
  params: Promise<{ organizationId: string }>;
};

const OrganizationSettingsPage = async ({
  params,
}: OrganizationSettingsPageProps) => {
  const { organizationId } = await params;

  const organization = await auth.api.getFullOrganization({
    headers: await headers(),
    query: { organizationId },
  });

  if (!organization) return <p>Organization not found.</p>;

  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Organization Settings"
        description="Manage your organization details."
        tabs={
          <OrganizationBreadcrumbs
            organizationName={organization.name ?? "Organization"}
          />
        }
      />
      <UpdateOrganizationForm
        organizationId={organizationId}
        name={organization.name}
        slug={organization.slug}
        logo={organization.logo}
      />
    </div>
  );
};

export default OrganizationSettingsPage;
