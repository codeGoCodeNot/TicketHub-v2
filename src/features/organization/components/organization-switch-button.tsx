"use client";

import Form from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "react";
import switchOrganization from "../actions/switch-organization";

type OrganizationSwitchButtonProps = {
  organizationId: string;
  trigger: React.ReactNode;
};

const OrganizationSwitchButtons = ({
  organizationId,
  trigger,
}: OrganizationSwitchButtonProps) => {
  const [actionState, action] = useActionState(
    switchOrganization.bind(null, organizationId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      {trigger}
    </Form>
  );
};

export default OrganizationSwitchButtons;
