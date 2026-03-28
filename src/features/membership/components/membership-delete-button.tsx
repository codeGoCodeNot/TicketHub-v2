"use client";

import { toActionState } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { authClient } from "@/lib/auth-client";
import { LucideLoaderCircle, LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type MembershipListProps = {
  organizationId: string;
  memberId: string;
};

const MembershipDeleteButton = ({
  organizationId,
  memberId,
}: MembershipListProps) => {
  const router = useRouter();

  const handleDelete = async () => {
    const { error } = await authClient.organization.removeMember({
      organizationId,
      memberIdOrEmail: memberId,
    });
    if (error)
      return toActionState("ERROR", error.message ?? "Something went wrong");
    return toActionState("SUCCESS", "Member removed successfully");
  };

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: handleDelete,
    trigger: (isPending) => (
      <Button variant="destructive" size="icon">
        {isPending ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideLogOut />
        )}
      </Button>
    ),
    onSuccess: () => router.refresh(),
    title: "Remove Member",
    description:
      "Are you sure you want to remove this member from the organization?",
    pendingMessage: "Removing member...",
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
};

export default MembershipDeleteButton;
