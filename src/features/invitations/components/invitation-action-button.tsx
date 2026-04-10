"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { LucideLoader } from "lucide-react";

type InvitationDeleteButtonProps = {
  action: () => Promise<any>;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "outline";
};

const InvitationActionButton = ({
  action,
  title,
  description,
  icon,
  variant = "destructive",
}: InvitationDeleteButtonProps) => {
  const [trigger, dialog] = useConfirmDialog({
    action,
    trigger: (isPending) => (
      <Button variant={variant} size="icon">
        {isPending ? <LucideLoader className="animate-spin" /> : icon}
      </Button>
    ),
    title,
    description,
    pendingMessage: `${title} in progress...`,
  });

  return (
    <>
      {trigger}
      {dialog}
    </>
  );
};

export default InvitationActionButton;
