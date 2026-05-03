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
      variant={isCurrentCommentEditing ? "secondary" : "ghost"}
      size="icon"
      className="size-8"
      onClick={() => startEditing(commentId)}
      disabled={isCurrentCommentEditing}
      aria-label="Edit comment"
    >
      <LucidePencil className="size-4" />
    </Button>
  );
};

export default CommentEditTriggerButton;
