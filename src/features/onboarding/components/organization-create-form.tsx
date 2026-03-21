"use client";

import Form from "@/components/form/form";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import createOrganization from "../actions/create-organization";
import SubmitButton from "@/components/form/submit-button";
import FieldError from "@/components/form/field-error";

const OrganizationCreateForm = () => {
  const [actionState, action] = useActionState(
    createOrganization,
    EMPTY_ACTION_STATE,
  );

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="name"
        placeholder="Organization Name"
        defaultValue={actionState.payload?.get("name") as string}
      />
      <FieldError actionState={actionState} name="name" />
      <SubmitButton label="Create" />
    </Form>
  );
};

export default OrganizationCreateForm;
