"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { PasswordInput } from "@/components/password-input";
import { useActionState } from "react";
import passwordReset from "../actions/password-reset";
import { Input } from "@/components/ui/input";

type PasswordResetFormProps = {
  token: string;
};

const PasswordResetForm = ({ token }: PasswordResetFormProps) => {
  const [actionState, action] = useActionState(
    passwordReset,
    EMPTY_ACTION_STATE,
  );

  return (
    <>
      <Form action={action} actionState={actionState}>
        <Input type="hidden" name="token" value={token} />

        <PasswordInput
          autoComplete="new-password"
          placeholder="Password"
          name="newPassword"
          defaultValue={actionState.payload?.get("newPassword") as string}
        />
        <FieldError actionState={actionState} name="newPassword" />

        <PasswordInput
          autoComplete="new-password"
          placeholder="Confirm Password"
          name="confirmPassword"
          defaultValue={actionState.payload?.get("confirmPassword") as string}
        />
        <FieldError actionState={actionState} name="confirmPassword" />

        <SubmitButton label="Reset Password" />
      </Form>
    </>
  );
};

export default PasswordResetForm;
