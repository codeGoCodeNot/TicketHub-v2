"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateComment } from "../actions/update-comment";
import { useCommentEditState } from "./comment-edit-state";

type CommentEditInlineProps = {
  commentId: string;
  content: string;
  isOwner: boolean;
};

const CommentEditInline = ({
  commentId,
  content,
  isOwner,
}: CommentEditInlineProps) => {
  const { isEditing, stopEditing } = useCommentEditState();
  const isCurrentCommentEditing = isEditing(commentId);
  // Local draft lets users type freely before submit/cancel.
  const [draft, setDraft] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [actionState, action] = useActionState(
    updateComment.bind(null, commentId),
    EMPTY_ACTION_STATE,
  );

  //   Auto-focus the textarea when entering edit mode.
  useEffect(() => {
    if (isCurrentCommentEditing) {
      textareaRef.current?.focus();
    }
  }, [isCurrentCommentEditing]);

  const handleCancel = () => {
    // Reset unsaved changes and leave edit mode.
    setDraft(content);
    stopEditing(commentId);
  };

  const handleSuccess = () => {
    setDraft((currentDraft) => currentDraft.trim());
    stopEditing(commentId);
  };

  if (!isOwner || !isCurrentCommentEditing) {
    // Read-only view when not editing.
    return (
      <p className="text-muted-foreground whitespace-pre-wrap break-words">
        {content}
      </p>
    );
  }

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Textarea
        ref={textareaRef}
        name="content"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="min-h-24"
      />
      <FieldError actionState={actionState} name="content" />

      <div className="flex items-center justify-end gap-x-2">
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <SubmitButton label="Save" />
      </div>
    </Form>
  );
};

export default CommentEditInline;
