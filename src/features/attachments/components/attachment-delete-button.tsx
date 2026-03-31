"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { LucideLoaderCircle, LucideTrash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import deleteAttachment from "../actions/delete-attachments";

type AttachmentDeleteButtonProps = {
  id: string;
  onDeleteAttachment?: (id: string) => void;
};

const AttachmentDeleteButton = ({
  id,
  onDeleteAttachment,
}: AttachmentDeleteButtonProps) => {
  const router = useRouter();

  const [deleteButton, deleteDialog] = useConfirmDialog({
    title: "Delete Attachment",
    description: "Are you sure you want to delete this attachment?",
    trigger: (isPending) => (
      <Button variant="ghost" size="icon-xs">
        {isPending ? (
          <LucideLoaderCircle className="animate-spin" />
        ) : (
          <LucideTrash2 />
        )}
      </Button>
    ),
    action: deleteAttachment.bind(null, id),
    onSuccess: () => {
      onDeleteAttachment?.(id);
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

export default AttachmentDeleteButton;
