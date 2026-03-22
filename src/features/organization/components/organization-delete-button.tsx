"use client";
import { toActionState } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { authClient } from "@/lib/auth-client";
import { LucideLoaderCircle, LucideTrash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type OrganizationDeleteButton = {
  organizationId: string;
};

const OrganizationDeleteButton = ({
  organizationId,
}: OrganizationDeleteButton) => {
  const router = useRouter();

  const handleDelete = async () => {
    const { error } = await authClient.organization.delete({ organizationId });
    if (error) return toActionState("ERROR", "Failed to delete organization");
    return toActionState("SUCCESS", "Deleted organization successfully");
  };

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: handleDelete,
    trigger: (isPending) => (
      <Button
        variant="destructive"
        size="icon"
        className="text-primary-foreground"
      >
        {isPending ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideTrash2 />
        )}
      </Button>
    ),
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
};

export default OrganizationDeleteButton;
