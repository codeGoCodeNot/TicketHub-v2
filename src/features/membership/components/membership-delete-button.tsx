"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { LucideLoaderCircle, LucideLogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import deleteMember from "../actions/delete-member";

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
    return deleteMember(organizationId, memberId);
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
