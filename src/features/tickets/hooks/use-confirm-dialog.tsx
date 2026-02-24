"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cloneElement, useState } from "react";

type UseConfirmDialogProps = {
  action: () => Promise<void>;
  trigger: React.ReactElement<{ onClick?: () => void }>;
  title?: string;
  description?: string;
};

const useConfirmDialog = ({
  action,
  trigger,
  title,
  description,
}: UseConfirmDialogProps) => {
  const [open, setOpen] = useState(false);

  const dialogTrigger = cloneElement(trigger, {
    onClick: () => {
      setOpen((prev) => !prev);
    },
  });

  const dialog = (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || "Are you absolutely sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              "This action cannot be undone. This will permanently delete your account from our servers."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={action}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};

export default useConfirmDialog;
