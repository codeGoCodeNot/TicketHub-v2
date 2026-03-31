import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaperclipIcon } from "lucide-react";
import { useState } from "react";
import AttachmentCreateForm from "./attachment-create-form";

type AttachmentCreateButtonProps = {
  enitityId: string;
  entity: "COMMENT" | "TICKET";
  onSuccess?: () => void;
};

const AttachmentCreateButton = ({
  enitityId,
  entity,
  onSuccess,
}: AttachmentCreateButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen((prev) => !prev);
    onSuccess?.();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PaperclipIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Attachment</DialogTitle>
          <DialogDescription>Attach images or PDFs</DialogDescription>
        </DialogHeader>
        <AttachmentCreateForm
          entity={entity}
          entityId={enitityId}
          buttons={
            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <SubmitButton label="Upload" />
            </DialogFooter>
          }
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentCreateButton;
