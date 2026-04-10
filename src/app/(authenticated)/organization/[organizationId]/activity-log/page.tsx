import Heading from "@/components/heading";
import OrganizationBreadcrumbs from "@/components/organization-breadcrumbs";
import Spinner from "@/components/spinner";
import ActivityLogList from "@/features/activity-log/components/activity-log-list";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

type ActivityLogPageProps = {
  params: Promise<{ organizationId: string }>;
};

const ActivityLogPage = async ({ params }: ActivityLogPageProps) => {
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
        title="Activity Log"
        description="View all activities in your organization"
        tabs={
          <OrganizationBreadcrumbs
            organizationName={organization?.name ?? "Organization"}
          />
        }
      />

      <Suspense fallback={<Spinner />}>
        <ActivityLogList organizationId={organizationId} />
      </Suspense>
    </div>
  );
};

export default ActivityLogPage;
