"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { LucideTrash2 } from "lucide-react";
import { deleteComment } from "../actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
  onHandleDelete?: (id: string) => void;
};

const CommentDeleteButton = ({
  id,
  onHandleDelete,
}: CommentDeleteButtonProps) => {
  const [deleteButton, deleteDialog] = useConfirmDialog({
    action: deleteComment.bind(null, id),
    trigger: (
      <Button variant="destructive" size="icon">
        <LucideTrash2 />
      </Button>
    ),
    onSuccess: () => onHandleDelete?.(id),
  });

  return (
    <>
      {deleteButton}
      {deleteDialog}
    </>
  );
};

export default CommentDeleteButton;
