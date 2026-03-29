"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LucideX } from "lucide-react";
import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import createAttachments from "../actions/create-attachments";
import { ACCEPTED, ACCEPTED as IMAGE_TYPES } from "../constants";
import useActionFeedback from "@/components/form/hooks/use-action-feedback";

type PreviewFile = {
  file: File;
  previewURL: string | null;
};

type AttachmentCreateFormProps = {
  ticketId: string;
};

const AttachmentCreateForm = ({ ticketId }: AttachmentCreateFormProps) => {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, ticketId),
    EMPTY_ACTION_STATE,
  );

  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useActionFeedback(actionState, {
    onSuccess: () => {
      setPreviews([]);
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const IMAGE_TYPES = ACCEPTED.filter((type) => type.startsWith("image/"));
    const newPreviews = files.map((file) => ({
      file,
      previewURL: IMAGE_TYPES.includes(file.type)
        ? URL.createObjectURL(file)
        : null,
    }));

    setPreviews(newPreviews);
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      const dt = new DataTransfer();
      updated.forEach((preview) => dt.items.add(preview.file));
      if (inputRef.current) inputRef.current.files = dt.files;
      return updated;
    });
  };

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
