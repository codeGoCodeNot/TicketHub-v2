"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { PasswordInput } from "@/components/password-input";
import { Input } from "@/components/ui/input";
import { passwordForgotPagePath } from "@/path";
import Link from "next/link";
import { useActionState } from "react";
import signInEmail from "../actions/sign-in-email";
import SignInProviderForm from "./sign-in-provider-form";

const SignInForm = () => {
  const [actionState, action] = useActionState(signInEmail, EMPTY_ACTION_STATE);

  return (
    <>
      <Form action={action} actionState={actionState}>
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
        />
        <FieldError actionState={actionState} name="password" />
        <div className="text-sm text-muted-foreground underline">
          <Link href={passwordForgotPagePath()}>Forgot Password?</Link>
        </div>

        <SubmitButton label="Sign In" />
      </Form>
      <SignInProviderForm />
    </>
  );
};

export default SignInForm;
