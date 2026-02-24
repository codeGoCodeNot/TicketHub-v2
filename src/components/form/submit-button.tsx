"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { LucideLoader2 } from "lucide-react";

type SubmitButtonProps = {
  label: string;
};

const SubmitButton = ({ label }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <LucideLoader2 className="animate-spin" />}
      {label}
    </Button>
  );
};

export default SubmitButton;
