"use client";

import SubmitButton from "@/components/form/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "../actions/create-comment";
import Form from "@/components/form/form";
import { useActionState } from "react";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import FieldError from "@/components/form/field-error";

type CommentCreateFormProps = {
  ticketId: string;
};

const CommentCreateForm = ({ ticketId }: CommentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createComment.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Textarea placeholder="Write a comment..." name="content" />
      <FieldError name="content" actionState={actionState} />

      <SubmitButton label="Comment" />
    </Form>
  );
};

export default CommentCreateForm;
