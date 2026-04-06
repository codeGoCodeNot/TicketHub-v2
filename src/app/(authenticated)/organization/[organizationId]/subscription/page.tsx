import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { pricingPagePath } from "@/path";
import { headers } from "next/headers";
import Link from "next/link";

type SubscriptionPageProps = {
  params: Promise<{ organizationId: string }>;
};

const SubscriptionPage = async ({ params }: SubscriptionPageProps) => {
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
        title="Subscription"
        description="Manage your organization subscription."
        tabs={
          <OrganizationBreadcrumbs
            organizationName={organization?.name ?? "Organization"}
          />
        }
      />
      <Placeholder
        label="No subscription for this organization"
        button={
          <Button asChild variant="outline">
            <Link href={pricingPagePath()}>Go to pricing</Link>
          </Button>
        }
      />
    </div>
  );
};

export default SubscriptionPage;
