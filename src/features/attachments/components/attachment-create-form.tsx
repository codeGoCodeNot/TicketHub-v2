"use client";

import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { useActionState } from "react";
import createAttachments from "../actions/create-attachments";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import { ACCEPTED } from "../constants";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";

type AttachmentCreateFormProps = {
  ticketId: string;
};

const AttachmentCreateForm = ({ ticketId }: AttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );
  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="files"
        type="file"
        id="files"
        multiple
        accept={ACCEPTED.join(",")}
      />

      <FieldError actionState={actionState} name="files" />

      <SubmitButton label="Upload" />
    </Form>
  );
};

export default AttachmentCreateForm;
