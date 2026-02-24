"use client";

import useActionFeedback from "@/components/form/hooks/use-action-feedback";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/components/form/utils/to-action-state";
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
import { Button } from "@/components/ui/button";
import {
  cloneElement,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

type UseConfirmDialogProps = {
  action: () => Promise<ActionState>;
  trigger: React.ReactElement<{ onClick?: () => void }>;
  title?: string;
  description?: string;
  pendingMessage?: string;
  onSuccess?: (actionState: ActionState) => void;
};

const useConfirmDialog = ({
  action,
  trigger,
  title,
  description,
  pendingMessage = "Deleting...",
  onSuccess,
}: UseConfirmDialogProps) => {
  const [open, setOpen] = useState(false);

  const dialogTrigger = cloneElement(trigger, {
    onClick: () => {
      setOpen((prev) => !prev);
    },
  });

  const [actionState, formAction, isPending] = useActionState(
    action,
    EMPTY_ACTION_STATE,
  );

  const toastRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isPending) {
      toastRef.current = toast.loading(pendingMessage);
    } else if (toastRef.current) {
      toast.dismiss(toastRef.current);
    }

    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isPending, pendingMessage]);

  useActionFeedback(actionState, {
    onSuccess: ({ actionState }) => {
      if (actionState.message) toast.success(actionState.message);
      onSuccess?.(actionState);
    },
    onError: ({ actionState }) => {
      if (actionState.message) toast.error(actionState.message);
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
          <AlertDialogAction asChild>
            <form action={formAction}>
              <Button type="submit">Confirm</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [dialogTrigger, dialog];
};

export default useConfirmDialog;
