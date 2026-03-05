"use client";

import { Button } from "@/components/ui/button";
import { LucidePencil } from "lucide-react";
import { useCommentEditState } from "./comment-edit-state";

type CommentEditTriggerButtonProps = {
  commentId: string;
};

const CommentEditTriggerButton = ({
  commentId,
}: CommentEditTriggerButtonProps) => {
  const { isEditing, startEditing } = useCommentEditState();
  const isCurrentCommentEditing = isEditing(commentId);

  return (
    <Button
      type="button"
      // Visual state reflects whether this row is currently in edit mode.
      variant={isCurrentCommentEditing ? "secondary" : "outline"}
      size="icon"
      onClick={() => startEditing(commentId)}
      disabled={isCurrentCommentEditing}
      aria-label="Edit comment"
    >
      <LucidePencil />
    </Button>
  );
};

export default CommentEditTriggerButton;
