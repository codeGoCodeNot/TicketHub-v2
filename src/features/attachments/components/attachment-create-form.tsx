"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import useActionFeedback from "@/components/form/hooks/use-action-feedback";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideX } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import createAttachments from "../actions/create-attachments";
import { ACCEPTED as IMAGE_TYPES } from "../constants";
import useFilePreview from "./hooks/use-file-preview";

type AttachmentCreateFormProps = {
  ticketId: string;
};

const AttachmentCreateForm = ({ ticketId }: AttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  const { previews, inputRef, handleFileChange, handleRemove, reset } =
    useFilePreview();

  useActionFeedback(actionState, {
    onSuccess: reset,
  });

  return (
    <Form action={action} actionState={actionState}>
      <Input
        ref={inputRef}
        name="files"
        type="file"
        id="files"
        multiple
        accept={IMAGE_TYPES.join(",")}
        onChange={handleFileChange}
      />

      <FieldError actionState={actionState} name="files" />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {preview.previewURL ? (
                <Image
                  src={preview.previewURL}
                  alt={preview.file.name}
                  width={80}
                  height={80}
                />
              ) : (
                <div className="w-20 h-20 rounded-md border flex items-center justify-center text-center text-xs text-muted-foreground p-1">
                  Preview not available for {preview.file.name}
                </div>
              )}
              <Button
                type="button"
                variant="default"
                size="icon"
                className="absolute -top-2 -right-2 w-5 h-5"
                onClick={() => handleRemove(index)}
              >
                <LucideX className="text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <SubmitButton label="Upload" />
    </Form>
  );
};

export default AttachmentCreateForm;
