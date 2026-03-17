"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { PasswordInput } from "@/components/password-input";
import PasswordStrengthMeter from "@/components/password-strenght-meter";
import { useActionState, useState } from "react";
import passwordChange from "../actions/password-change";

const PasswordChangeForm = () => {
  const [actionState, action] = useActionState(
    passwordChange,
    EMPTY_ACTION_STATE,
  );

  const [password, setPassword] = useState("");

  return (
    <Form
      action={action}
      actionState={actionState}
      onSuccess={() => setPassword("")}
    >
      <PasswordInput
        autoComplete="current-password"
        placeholder="Current Password"
        name="currentPassword"
        defaultValue={actionState.payload?.get("currentPassword") as string}
      />
      <FieldError actionState={actionState} name="currentPassword" />

      <PasswordInput
        autoComplete="new-password"
        placeholder="Password"
        name="newPassword"
        defaultValue={actionState.payload?.get("newPassword") as string}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FieldError actionState={actionState} name="newPassword" />

      <PasswordStrengthMeter password={password} />

      <PasswordInput
        autoComplete="new-password"
        placeholder="Confirm Password"
        name="confirmPassword"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <SubmitButton label="Change Password" />
    </Form>
  );
};

export default PasswordChangeForm;
