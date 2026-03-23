"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { organizationParser } from "@/features/tickets/search-params";
import { authClient } from "@/lib/auth-client";
import { useQueryState } from "nuqs";
import { check } from "zod";

const OrganizationTicketFilter = () => {
  const [byOrganization, setByOrganization] = useQueryState(
    "byOrganization",
    organizationParser.byOrganization,
  );

  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <div className="w-full max-w-[420px] flex items-center gap-x-2">
      <Switch
        id="byOrganization"
        checked={!!byOrganization}
        onCheckedChange={(checked) =>
          setByOrganization(checked ? (activeOrganization?.slug ?? "") : "")
        }
      />
      <Label htmlFor="byOrganization" className="text-sm cursor-pointer">
        {byOrganization
          ? `${activeOrganization?.name ?? "Active Organization"}`
          : "All my tickets"}
      </Label>
    </div>
  );
};

export default OrganizationTicketFilter;
