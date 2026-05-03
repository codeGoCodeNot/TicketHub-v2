"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useRef, useState } from "react";
import Linkify from "linkify-react";
import { updateComment } from "../actions/update-comment";
import { useCommentEditState } from "./comment-edit-state";
import renderLink from "../utils/render-link";

type CommentEditInlineProps = {
  commentId: string;
  content: string;
  isOwner: boolean;
  onUpdate?: () => void;
};

const CommentEditInline = ({
  commentId,
  content,
  isOwner,
  onUpdate,
}: CommentEditInlineProps) => {
  const { isEditing, stopEditing } = useCommentEditState();
  const isCurrentCommentEditing = isEditing(commentId);
  const [draft, setDraft] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [actionState, action] = useActionState(
    updateComment.bind(null, commentId),
    EMPTY_ACTION_STATE,
  );

  useEffect(() => {
    if (isCurrentCommentEditing) {
      textareaRef.current?.focus();
    }
  }, [isCurrentCommentEditing]);

  const handleCancel = () => {
    setDraft(content);
    stopEditing(commentId);
  };

  const handleSuccess = () => {
    setDraft((currentDraft) => currentDraft.trim());
    stopEditing(commentId);
    onUpdate?.();
  };

  if (!isOwner || !isCurrentCommentEditing) {
    return (
      <div className="flex flex-col">
        <Linkify
          as="p"
          className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words"
          options={{ render: renderLink }}
        >
          {content}
        </Linkify>
      </div>
    );
  }

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Textarea
        ref={textareaRef}
        name="content"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="min-h-24 resize-none"
      />
      <FieldError actionState={actionState} name="content" />

      <div className="flex items-center justify-between gap-x-2 mt-1">
        <Input
          type="file"
          name="files"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="text-xs flex-1"
        />
        <div className="flex items-center gap-x-2 shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <SubmitButton label="Save" />
        </div>
      </div>
    </Form>
  );
};

export default CommentEditInline;
