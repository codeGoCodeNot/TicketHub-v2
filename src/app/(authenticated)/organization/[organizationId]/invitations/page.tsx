import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";

type InvitationPageProps = {
  params: Promise<{ organizationId: string }>;
};

const InvitationPage = async ({ params }: InvitationPageProps) => {
  const { organizationId } = await params;
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Invitations"
        description="Manage your organization invitations."
        tabs={<OrganizationBreadcrumbs />}
      />
    </div>
  );
};

export default InvitationPage;
