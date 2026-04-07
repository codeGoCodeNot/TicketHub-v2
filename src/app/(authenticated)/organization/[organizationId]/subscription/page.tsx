import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import Placeholder from "@/components/placeholder";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import CustomerPortalForm from "@/features/stripe/components/customer-portal-form";
import Products from "@/features/stripe/components/products";
import { auth } from "@/lib/auth";
import { pricingPagePath } from "@/path";
import { LucideSettings } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

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
        actions={
          <CustomerPortalForm organizationId={organizationId}>
            <>
              <LucideSettings />
              Manage subscription
            </>
          </CustomerPortalForm>
        }
      />

      <Suspense fallback={<Spinner />}>
        <Products organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default SubscriptionPage;
