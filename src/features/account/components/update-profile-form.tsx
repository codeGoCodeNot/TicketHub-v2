"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import updateProfile from "../actions/update-profile";

type UpdateProfileFormProps = {
  username: string;
  email: string;
  image?: string | null;
};

const UpdateProfileForm = ({ username, email }: UpdateProfileFormProps) => {
  const [actionState, action] = useActionState(
    updateProfile,
    EMPTY_ACTION_STATE,
  );

  return (
    <>
      <Form action={action} actionState={actionState}>
        <Input
          name="email"
          placeholder="Email"
          defaultValue={(actionState.payload?.get("email") as string) ?? email}
        />
        <FieldError actionState={actionState} name="email" />

        <Input
          name="name"
          placeholder="Username"
          defaultValue={
            (actionState.payload?.get("name") as string) ?? username
          }
        />
        <FieldError actionState={actionState} name="name" />

        <SubmitButton label="Save Changes" />
      </Form>
    </>
  );
};

export default UpdateProfileForm;
