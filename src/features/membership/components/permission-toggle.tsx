"use client";

import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { LucideBan, LucideCheck } from "lucide-react";
import { useActionState } from "react";
import togglePermission from "../actions/toggle-permission";

type PermissionToggleProps = {
  userId: string;
  organizationId: string;
  canDeleteTickets: boolean;
};

const PermissionToggle = ({
  userId,
  organizationId,
  canDeleteTickets,
}: PermissionToggleProps) => {
  const [actionState, action] = useActionState(
    togglePermission.bind(null, userId, organizationId, !canDeleteTickets),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton
        icon={canDeleteTickets ? <LucideCheck /> : <LucideBan />}
        variant={canDeleteTickets ? "outline" : "destructive"}
        size="icon"
      />
    </Form>
  );
};

export default PermissionToggle;
