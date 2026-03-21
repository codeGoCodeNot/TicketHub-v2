"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { LucideLoader2 } from "lucide-react";

type SubmitButtonProps = {
  label?: string;
  icon?: React.ReactNode;
  variant?:
    | "outline"
    | "default"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
};

const SubmitButton = ({ label, icon, variant, size }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant={variant} size={size}>
      {pending && <LucideLoader2 className="animate-spin" />}
      {pending ? null : icon}
      {label}
    </Button>
  );
};

export default SubmitButton;
