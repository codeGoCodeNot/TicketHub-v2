"use client";

import { toActionState } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { authClient } from "@/lib/auth-client";
import { LucideLoaderCircle, LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type OrganizationLeaveButtonProps = {
  organizationId: string;
};

const OrganizationLeaveButton = ({
  organizationId,
}: OrganizationLeaveButtonProps) => {
  const router = useRouter();

  const handleLeave = async () => {
    const { error } = await authClient.organization.leave({ organizationId });
    if (error)
      return toActionState("ERROR", error.message ?? "Something went wrong");
    return toActionState("SUCCESS", "You left the organization");
  };

  const [leaveButton, leaveDialog] = useConfirmDialog({
    title: "Leave Organization",
    description: "Are you sure you want to leave this organization?",
    pendingMessage: "Leaving organization...",
    action: handleLeave,
    trigger: (isPending) => (
      <Button
        variant="destructive"
        size="icon"
        className="text-primary-foreground"
      >
        {isPending ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideLogOut />
        )}
      </Button>
    ),
    onSuccess: () => router.refresh(),
  });

  return (
    <>
      {leaveButton}
      {leaveDialog}
    </>
  );
};

export default OrganizationLeaveButton;
