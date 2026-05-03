"use client";

import { ActionState } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { LucideLoaderCircle, LucideTrash2 } from "lucide-react";
import { deleteComment } from "../actions/delete-comment";

type CommentDeleteButtonProps = {
  id: string;
  onHandleDelete?: (commentId: string) => void;
  onBeforeDelete?: () => void;
  onRollbackDelete?: () => void;
};

const CommentDeleteButton = ({
  id,
  onHandleDelete,
  onBeforeDelete,
  onRollbackDelete,
}: CommentDeleteButtonProps) => {
  const action = async (_: ActionState) => {
    onBeforeDelete?.();
    const result = await deleteComment(id);
    if (result.status === "ERROR") {
      onRollbackDelete?.();
    }
    return result;
  };

  const [deleteButton, deleteDialog] = useConfirmDialog({
    action,
    trigger: (isPending) => (
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-destructive"
      >
        {isPending ? (
          <LucideLoaderCircle className="size-4 animate-spin" />
        ) : (
          <LucideTrash2 className="size-4" />
        )}
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
