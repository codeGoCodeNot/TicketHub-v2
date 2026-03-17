"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import passwordForgot from "../actions/passwordforgot";

const PasswordForgotForm = () => {
  const [actionState, action] = useActionState(
    passwordForgot,
    EMPTY_ACTION_STATE,
  );

  return (
    <>
      <Form action={action} actionState={actionState}>
        <Input
          name="email"
          placeholder="Email"
          defaultValue={actionState.payload?.get("email") as string}
        />
        <FieldError actionState={actionState} name="email" />

        <SubmitButton label="Reset Password" />
      </Form>
    </>
  );
};

export default PasswordForgotForm;
