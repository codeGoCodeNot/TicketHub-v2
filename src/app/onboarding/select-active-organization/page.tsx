import Heading from "@/components/heading";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import OrganizationList from "@/features/organization/components/organization-list";
import { onboardPath, organizationCreatePagePath } from "@/path";

import Link from "next/link";
import { Suspense } from "react";

const SelectActiveOrganization = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-8">
      <Heading
        title="Select Organization"
        description="All your organizations"
        actions={
          <Button asChild>
            <Link href={onboardPath()}>+ Create Organization</Link>
          </Button>
        }
      />

      <Suspense fallback={<Spinner />}>
        <OrganizationList onlySwitch />
      </Suspense>
    </div>
  );
};

export default SelectActiveOrganization;
