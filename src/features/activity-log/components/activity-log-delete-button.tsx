"use client";

import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import { LucideLoader } from "lucide-react";

type ActivityLogsDeleteButtonProps = {
  action: () => Promise<any>;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "outline";
  onSuccess?: () => void;
};

const ActivityLogsDeleteButton = ({
  action,
  title,
  description,
  icon,
  variant = "destructive",
  onSuccess,
}: ActivityLogsDeleteButtonProps) => {
  const [trigger, dialog] = useConfirmDialog({
    action,
    trigger: (isPending) => (
      <Button variant={variant} size="icon">
        {isPending ? <LucideLoader className="animate-spin" /> : icon}
      </Button>
    ),
    title,
    description,
    onSuccess,
  });

  return (
    <>
      {trigger}
      {dialog}
    </>
  );
};

export default ActivityLogsDeleteButton;
