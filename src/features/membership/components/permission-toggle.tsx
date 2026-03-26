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
  canUpdateTickets: boolean;
  permissionType: "canDeleteTickets" | "canUpdateTickets";
};

const PermissionToggle = ({
  userId,
  organizationId,
  canDeleteTickets,
  canUpdateTickets,
  permissionType,
}: PermissionToggleProps) => {
  const currentValue =
    permissionType === "canDeleteTickets" ? canDeleteTickets : canUpdateTickets;

  const [actionState, action] = useActionState(
    togglePermission.bind(
      null,
      userId,
      organizationId,
      permissionType,
      !currentValue,
    ),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <SubmitButton
        icon={currentValue ? <LucideCheck /> : <LucideBan />}
        variant={currentValue ? "outline" : "destructive"}
        size="icon"
      />
    </Form>
  );
};

export default PermissionToggle;
