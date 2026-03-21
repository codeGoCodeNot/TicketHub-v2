"use client";

import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import deleteOrganization from "../actions/delete-organization";
import { Button } from "@/components/ui/button";
import { LucideLoaderCircle, LucideTrash2 } from "lucide-react";

type OrganizationDeleteButton = {
  organizationId: string;
};

const OrganizationDeleteButton = ({
  organizationId,
}: OrganizationDeleteButton) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteOrganization.bind(null, organizationId),
    trigger: (isPending) => (
      <Button variant="destructive" size="icon">
        {isPending ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideTrash2 />
        )}
      </Button>
    ),
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
};

export default OrganizationDeleteButton;
