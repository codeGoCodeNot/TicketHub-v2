"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Input } from "@/components/ui/input";
import { useActionState, useState } from "react";
import signUp from "../actions/sign-up";
import { PasswordInput } from "@/components/password-input";
import PasswordStrengthMeter from "@/components/password-strenght-meter";

const SignUpForm = () => {
  const [actionState, action] = useActionState(signUp, EMPTY_ACTION_STATE);
  const [password, setPassword] = useState("");

  return (
    <Form action={action} actionState={actionState}>
      <Input
        name="name"
        placeholder="Username"
        defaultValue={actionState.payload?.get("name") as string}
      />
      <FieldError actionState={actionState} name="name" />

      <Input
        name="email"
        placeholder="Email"
        defaultValue={actionState.payload?.get("email") as string}
      />
      <FieldError actionState={actionState} name="email" />

      <PasswordInput
        autoComplete="new-password"
        placeholder="Password"
        name="password"
        defaultValue={actionState.payload?.get("password") as string}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FieldError actionState={actionState} name="password" />
      <PasswordStrengthMeter password={password} />

      <PasswordInput
        autoComplete="new-password"
        placeholder="Confirm Password"
        name="confirmPassword"
        defaultValue={actionState.payload?.get("confirmPassword") as string}
      />
      <FieldError actionState={actionState} name="confirmPassword" />

      <SubmitButton label="Sign Up" />
    </Form>
  );
};

export default SignUpForm;
