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

type CommentCreateFormProps = {
  ticketId: string;
  onCreateComment?: (comment: CommentWithMetadata) => void;
};

const CommentCreateForm = ({
  ticketId,
  onCreateComment,
}: CommentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  const handleSuccess = (actionState: ActionState) => {
    onCreateComment?.(actionState.data as CommentWithMetadata);
  };

  return (
    <Form action={action} actionState={actionState} onSuccess={handleSuccess}>
      <Textarea placeholder="Write a comment..." name="content" />
      <FieldError name="content" actionState={actionState} />

      <SubmitButton label="Comment" />
    </Form>
  );
};

export default CommentCreateForm;
