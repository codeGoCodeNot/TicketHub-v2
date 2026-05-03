"use client";

import SubmitButton from "@/components/form/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "../actions/create-comment";
import Form from "@/components/form/form";
import { useActionState } from "react";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
import FieldError from "@/components/form/field-error";
import { CommentWithMetadata } from "../type";
import { Input } from "@/components/ui/input";
import { ACCEPTED } from "@/features/attachments/constants";

type CommentCreateFormProps = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetadata) => void;
  onBeforeSubmit?: (content: string) => void;
  onError?: () => void;
};

const CommentCreateForm = ({
  ticketId,
  onCreateComment,
  onBeforeSubmit,
  onError,
}: CommentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  const handleSuccess = (actionState: ActionState) => {
    onCreateComment?.(actionState.data as CommentWithMetadata);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const content = (new FormData(e.currentTarget).get("content") as string) ?? "";
    if (content.trim()) onBeforeSubmit?.(content);
  };

  return (
    <Form
      action={action}
      actionState={actionState}
      onSuccess={handleSuccess}
      onError={onError}
      onSubmit={handleSubmit}
    >
      <Textarea
        placeholder="Write a comment..."
        name="content"
        className="min-h-[80px] resize-none"
      />
      <FieldError name="content" actionState={actionState} />

      <div className="flex items-center gap-x-2">
        <Input
          name="files"
          id="files"
          type="file"
          multiple
          accept={ACCEPTED.join(", ")}
          className="text-xs flex-1"
        />
        <SubmitButton label="Comment" />
      </div>
    </Form>
  );
};

export default CommentCreateForm;
